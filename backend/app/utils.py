from nba_api.stats.endpoints import teamgamelog
from nba_api.stats.static import teams
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_selection import SelectKBest, f_classif
from nba_api.stats.endpoints import scoreboardv2
from nba_api.stats.endpoints import CommonTeamRoster
from datetime import datetime, timedelta
from pytz import timezone
import pandas as pd
import matplotlib.pyplot as plt
import time

nba_teams = teams.get_teams()
teams_df = pd.DataFrame(nba_teams)

# Helper function to avoid api rate limits
def safe_request(func, *args, **kwargs):
    while True:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"Error: {e}. Retrying in 5 seconds...")
            time.sleep(5)

def get_team_id(abbr):
    team = teams_df[teams_df['abbreviation'] == abbr.upper()]
    if not team.empty:
        return team.iloc[0]['id']
    else:
        raise ValueError(f"Team abbreviation '{abbr}' not found.")

def get_team_abbr(team_id):
    team = teams_df[teams_df['id'] == team_id]
    if not team.empty:
        return team.iloc[0]['abbreviation']
    else:
        raise ValueError(f"No team found for ID: {team_id}")

def get_team_name(team_id):
    team = teams_df[teams_df['id'] == team_id]
    if not team.empty:
        return team.iloc[0]['full_name']
    else:
        raise ValueError(f"No team found for ID: {team_id}")

def get_team_stats(team_id, season, cutoff_date=None, n=5):
    log = safe_request(teamgamelog.TeamGameLog, team_id=team_id, season=season)
    df = log.get_data_frames()[0]

    df = df[['GAME_DATE', 'MATCHUP', 'WL', 'PTS', 'OREB', 'DREB', 'FG_PCT', 'AST', 'TOV', 'STL', 'BLK']].copy()

    df['SEASON'] = season
    df['TEAM'] = get_team_name(team_id)
    df['HOME'] = df['MATCHUP'].str.contains('vs.').astype(int)
    df['WIN'] = df['WL'].apply(lambda x: 1 if x == 'W' else 0)
    df['STREAK'] = df['WIN'].rolling(window=n).sum().shift(-1).fillna(0)
    df['OPP_ABBR'] = df['MATCHUP'].str.extract(r'@ (\w+)|vs\. (\w+)').bfill(axis=1).iloc[:, 0]
    df['GAME_DATE'] = pd.to_datetime(df['GAME_DATE'], format='%b %d, %Y')

    if cutoff_date:
        df = df[df['GAME_DATE'] < pd.to_datetime(cutoff_date)]

    df = df.sort_values('GAME_DATE', ascending=False).reset_index(drop=True)

    # avg stats from last 5 games
    rolling_features = ['PTS', 'OREB', 'DREB', 'FG_PCT', 'AST', 'TOV', 'STL', 'BLK']
    for col in rolling_features:
        df[f'{col}_AVG'] = df[col].rolling(window=n).mean().shift(-1)

    df['DEFENSE_SCORE'] = df['STL_AVG'] + df['BLK_AVG'] + df['DREB_AVG']
    df['AST_TOV_RATIO'] = df['AST_AVG'] / (df['TOV_AVG'] + 1)
    df['EFFICIENCY'] = df['FG_PCT_AVG'] * df['PTS_AVG']
    df['PREV_GAME_DATE'] = df['GAME_DATE'].shift(-1)
    df['DAYS_REST'] = (df['GAME_DATE'] - df['PREV_GAME_DATE']).dt.days.clip(lower=0)
    df['BACK_TO_BACK'] = (df['GAME_DATE'] - df['PREV_GAME_DATE']).dt.days.eq(1).astype(int)
    df['B2B_ROAD'] = (df['BACK_TO_BACK'] == 1) & (df['HOME'] == 0).astype(int)

    df['FORM_SCORE'] = df['AST_TOV_RATIO'] + df['DEFENSE_SCORE'] + df['EFFICIENCY']

    df = df.dropna().reset_index(drop=True)
    return df

def add_opponent_features(df):
    abbr_to_name = teams_df.set_index('abbreviation')['full_name'].to_dict()
    df['OPPONENT_TEAM'] = df['OPP_ABBR'].map(abbr_to_name)

    df['GAME_KEY'] = df['GAME_DATE'].astype(str) + "_" + df['TEAM']
    df['OPP_GAME_KEY'] = df['GAME_DATE'].astype(str) + "_" + df['OPPONENT_TEAM']

    eff_map = df.set_index('GAME_KEY')['EFFICIENCY'].to_dict()
    form_map = df.set_index('GAME_KEY')['FORM_SCORE'].to_dict()
    streak_map = df.set_index('GAME_KEY')['STREAK'].to_dict()

    df['OPP_EFFICIENCY'] = df['OPP_GAME_KEY'].map(eff_map).fillna(0)
    df['OPP_FORM_SCORE'] = df['OPP_GAME_KEY'].map(form_map).fillna(0)
    df['OPP_STREAK'] = df['OPP_GAME_KEY'].map(streak_map).fillna(0)

    df['NET_EFFICIENCY'] = df['EFFICIENCY'] - df['OPP_EFFICIENCY']
    df['NET_FORM_SCORE'] = df['FORM_SCORE'] - df['OPP_FORM_SCORE']
    df['NET_STREAK'] = df['STREAK'] - df['OPP_STREAK']

    df = df.dropna().reset_index(drop=True)
    return df

def get_injuries():
    url = "https://www.espn.com/nba/injuries"
    tables = pd.read_html(url)

    all_injuries = []

    for table in tables:
        all_injuries.append(table)

    if not all_injuries:
        print("No injuries posted today.")
        return pd.DataFrame()

    df = pd.concat(all_injuries, ignore_index=True)
    df.columns = df.columns.str.upper()
    return df[['NAME', 'STATUS', 'EST. RETURN DATE']]

def get_team_injuries(team_abbr, injury_df):
    team_injuries = injury_df[injury_df['TEAM'] == team_abbr]

    if team_injuries.empty:
        return []

    return ", ".join(f"{row['NAME']} ({row['STATUS']})" for _, row in team_injuries.iterrows())

def get_all_rosters():
    all_rosters = []

    for _, row in teams_df.iterrows():
        team_id = row['id']
        team_abbr = row['abbreviation']
        team_name = row['full_name']

        try:
            roster = CommonTeamRoster(team_id=team_id, season='2024-25')
            roster_df = roster.get_data_frames()[0]
            roster_df['TEAM'] = team_abbr
            all_rosters.append(roster_df)
            time.sleep(1)
        except Exception as e:
            print(f"Skipping {team_name} due to error: {e}")

    final_roster = pd.concat(all_rosters, ignore_index=True)
    final_roster.columns = final_roster.columns.str.upper()
    return final_roster[['PLAYER', 'TEAM']]