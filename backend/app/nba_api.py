from datetime import datetime, timedelta
from pytz import timezone
import pandas as pd
from nba_api.stats.endpoints import scoreboardv2
from app.utils import (
    safe_request, get_team_abbr, get_team_name, 
    get_team_stats, get_injuries, get_all_rosters, 
    add_opponent_features, get_team_injuries
)

def run_colab_prediction_pipeline(model, features):
    today = datetime.now(timezone('US/Eastern')).strftime('%Y-%m-%d')
    tomorrow = (datetime.now(timezone('US/Eastern')) + timedelta(days=1)).strftime('%Y-%m-%d')
    date = tomorrow

    print("Fetching games for:", date, "\n")
    scoreboard = safe_request(scoreboardv2.ScoreboardV2, game_date=date)
    games = scoreboard.get_data_frames()[0]

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
            home_df = get_team_stats(home_id, season='2024-25').head(1).copy()
            away_df = get_team_stats(away_id, season='2024-25').head(1).copy()

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
