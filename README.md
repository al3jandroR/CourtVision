🏀CourtVision
A full-stack NBA game prediction app using real-time data, injury reports, and machine learning.

CourtVision is an expansion of my original NBA prediction model, which was developed as a class project in Google Colab using team statistics and classification models. This app takes that foundation and evolves it into a production-style web application.

What It Does
CourtVision predicts the outcomes of NBA games using:

Rolling team performance metrics

Real-time injury reports

Opponent-based matchup features

A trained machine learning model (Random Forest / Gradient Boosting)

Daily-cached results for quick frontend access

Stack Overview

Layer	Tech
Backend	Python, FastAPI
ML Model	scikit-learn (.pkl model)
Data Source	nba_api
Database	Neon (PostgreSQL)
Frontend	React (Vite)
Deployment	Fly.io (API) + Vercel (UI)
Cron Jobs	GitHub Actions (daily /predict + ping)
Auth	API Key protected endpoints
📦 Features
✅ FastAPI backend serves game predictions
✅ PostgreSQL database caches daily prediction results
✅ /predict endpoint runs once daily to reduce latency and cost
✅ /healthz endpoint used for warming backend before calls
✅ Frontend pings backend and displays predictions with retries
✅ Only available cached dates are shown in the UI
✅ Vercel handles frontend requests via API proxy to hide backend URL

In Progress
Adding player-level metrics to expand predictive accuracy

UI polish: dark mode, better loading states

Visualization of performance trends

Original Project
The core machine learning work behind CourtVision was first developed in this repo:
[nba-predictions](https://github.com/al3jandroR/nba_predictions)

🏁 Goal
To build a clean, interactive, data-driven web app for basketball prediction — one that’s expandable to player-level modeling, performance visualization, and potential betting insights.
