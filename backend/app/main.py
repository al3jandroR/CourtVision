from http.client import HTTPException
from fastapi import FastAPI, Query, Depends, HTTPException, status
from app.model import load_model, predict_games
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from fastapi.responses import JSONResponse
from app.db import init_db, load_prediction, save_prediction, get_available_dates
from app.nba_api import backfill_actual_scores
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
    if not date:
        date = datetime.date.today().isoformat()

    prediction = load_prediction(date)
    if prediction:
        return prediction

    print(f"[API] Generating prediction for {date}")
    result = predict_games(model, date)
    save_prediction(date, result)
    return result

@app.get("/loadpredict")
def load_predict(date: str = Query(None)):
    prediction = load_prediction(date)
    if prediction:
        return prediction

    raise HTTPException(
        status_code=404,
        detail=f"No predictions found for {date}"
    )

@app.get("/dates")
def get_dates(api_key: str = Depends(get_api_key)):
    try:
        dates = get_available_dates()
        return JSONResponse(content={"dates": dates})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
@app.post("/backfill-actuals")
def backfill_actuals(api_key: str = Depends(get_api_key)):
    return backfill_actual_scores(dry_run=False)

@app.post("/backfill-actuals-dry")
def backfill_dry(api_key: str = Depends(get_api_key)):
    return backfill_actual_scores()
