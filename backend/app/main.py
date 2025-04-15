from fastapi import FastAPI
from app.model import load_model, predict_games_today
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model()

@app.get("/")
def root():
    return {"message": "NBA Predictor API Running"}

@app.get("/predict-today")
def predict_today():
    return predict_games_today(model)