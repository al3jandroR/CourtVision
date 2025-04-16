from http.client import HTTPException
from fastapi import FastAPI, Query, Depends, HTTPException, status
from app.model import load_model, predict_games
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from app.db import init_db, load_prediction, save_prediction
import os, datetime

app = FastAPI()
model = load_model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://court-vision-tau.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

@app.on_event("startup")
def setup():
    init_db()
    today = datetime.date.today().isoformat()
    if not load_prediction(today):
        print(f"[STARTUP] Generating prediction for {today}")
        result = predict_games(model, today)
        save_prediction(today, result)


async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key == API_KEY:
        return api_key
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate API KEY"
        )

@app.get("/")
def root():
    return {"message": "NBA Predictor API Running"}

@app.get("/predict")
def predict(date: str = Query(None), api_key: str = Depends(get_api_key)):
    return predict_games(model, date)