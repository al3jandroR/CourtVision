from datetime import datetime, date as dt
from pytz import timezone
import pandas as pd
import time

from nba_api.stats.endpoints import scoreboardv2
from app.db import load_prediction, save_prediction, get_available_dates
from app.utils import (
    safe_request, get_team_abbr, get_team_name,
    get_team_stats, get_injuries, get_all_rosters,
    add_opponent_features, get_team_injuries, get_final_scores, get_game_id
)

def run_colab_prediction_pipeline(model, features, date=None):
    if date is None:
        date = datetime.now(timezone('US/Eastern')).strftime('%Y-%m-%d')

    print("Fetching games for:", date, "\n")
    scoreboard = safe_request(scoreboardv2.ScoreboardV2, game_date=date)
    games = scoreboard.get_data_frames()[0]

    if games.empty:
        return {"message": f"No games found on {date}"}

    print("Loading injury report...")
    injury_df = get_injuries()
    roster_df = get_all_rosters()

    injury_df = injury_df.merge(
        roster_df[['PLAYER', 'TEAM']],
        left_on='NAME',
        right_on='PLAYER',
        how='left'
    )

    matchups = games[['HOME_TEAM_ID', 'VISITOR_TEAM_ID']]

    output = []

    for _, row in matchups.iterrows():
        home_id = row['HOME_TEAM_ID']
        away_id = row['VISITOR_TEAM_ID']
        home = get_team_abbr(home_id)
        away = get_team_abbr(away_id)

        try:
            home_df = get_team_stats(home_id, season='2024-25', cutoff_date=date).head(1).copy()
            away_df = get_team_stats(away_id, season='2024-25', cutoff_date=date).head(1).copy()

            home_df['OPP_ABBR'] = away
            away_df['OPP_ABBR'] = home

            matchup_df = pd.concat([home_df, away_df], ignore_index=True)
            matchup_df = add_opponent_features(matchup_df)

            home_stats = matchup_df[matchup_df['TEAM'] == get_team_name(home_id)].copy()
            away_stats = matchup_df[matchup_df['TEAM'] == get_team_name(away_id)].copy()

            X_home = home_stats[features]
            X_away = away_stats[features]

            home_proba = model.predict_proba(X_home)[0][1]
            away_proba = model.predict_proba(X_away)[0][1]
            total = home_proba + away_proba
            nhome_proba = home_proba / total
            naway_proba = away_proba / total

            winner = home if home_proba > away_proba else away

            home_injuries = get_team_injuries(home, injury_df)
            away_injuries = get_team_injuries(away, injury_df)

            output.append({
                'Date': date,
                'Matchup': f"{away} @ {home}",
                'Predicted_Winner': winner,
                'Home_Prob': round(nhome_proba, 2),
                'Away_Prob': round(naway_proba, 2),
                'Home_raw': round(home_proba, 2),
                'Away_raw': round(away_proba, 2),
                'Home_Injuries': home_injuries,
                'Away_Injuries': away_injuries
            })

        except Exception as e:
            print(f"Error predicting {away} @ {home}: {e}")

    return {"predictions": output}

def backfill_actual_scores(dry_run=True):
    updated = 0
    skipped = 0
    dates = get_available_dates()

    for date in dates:
        cached = load_prediction(date)

        if not cached or "predictions" not in cached:
            continue
        if all("actual_winner" in g for g in cached["predictions"]):
            skipped += len(cached["predictions"])
            continue

        for game in cached["predictions"]:
            try:
                away, home = game["Matchup"].split(" @ ")
            except Exception as e:
                print(f"Could not parse matchup: {game.get('Matchup')} — {e}")
                continue

            try:
                game_id = get_game_id(date, home, away)
                if not game_id:
                    continue

                scores = get_final_scores(game_id)
                home_score = scores.get(home)
                away_score = scores.get(away)

                if home_score is None or away_score is None:
                    continue

                actual_winner = home if home_score > away_score else away

                game["Actual_Winner"] = actual_winner
                game["Home_Score"] = home_score
                game["Away_Score"] = away_score

                if not dry_run:
                    save_prediction(date, cached)
                    time.sleep(1)
                else:
                    print(f"[DRY RUN] {date}: {away} @ {home} → {home_score}-{away_score} | Winner: {actual_winner}")

                updated += 1

            except Exception as e:
                print(f"Error processing {home} vs {away} on {date}: {e}")

    return {"status": "complete", "updated": updated, "skipped": skipped}
