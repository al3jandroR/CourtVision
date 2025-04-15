import joblib
from app.nba_api import run_colab_prediction_pipeline

def load_model():
    return joblib.load("app/nba_model.pkl")

def predict_games_today(model):
    features = ['AST_TOV_RATIO', 'DEFENSE_SCORE', 'EFFICIENCY', 'FG_PCT_AVG', 'PTS_AVG', 'FORM_SCORE', 'NET_FORM_SCORE', 'NET_EFFICIENCY', 'NET_STREAK', 'STREAK']
    return run_colab_prediction_pipeline(model, features)
