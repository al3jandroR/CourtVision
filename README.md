# 🏀 CourtVision

> A full-stack NBA game prediction app using real-time data, injury reports, and machine learning.

CourtVision is an expansion of my original [NBA prediction model](https://github.com/al3jandroR/nba_predictions), which was developed as a class project in Google Colab using team statistics and classification models. This app takes that foundation and evolves it into a production-style web application.

## What It Does

CourtVision predicts the outcomes of NBA games using:
- Rolling team performance metrics
- Real-time injury reports
- Opponent-based matchup features
- A trained machine learning model (Random Forest / Gradient Boosting)

## Stack Overview

| Layer        | Tech                         |
|--------------|------------------------------|
| Backend      | Python, FastAPI              |
| ML Model     | scikit-learn (.pkl model)    |
| Data Source  | [nba_api](https://github.com/swar/nba_api) for live stats |
| Frontend     | React (Vite)                 |
| Deployment   | Render (API) + Vercel (UI) *(coming soon)*


## In Progress

✅ Backend API built with FastAPI  
✅ Model and injury logic migrated from notebook  
✅ Frontend connected to live predictions  
🛠 UI styling, loading UX, and error handling  
📦 Render + Vercel deployment coming next

## Original Project

The core machine learning work behind CourtVision was first developed in this repo:  
[nba-predictions](https://github.com/al3jandroR/nba_predictions)

---

## Goal

To build a clean, interactive, data-driven web app for basketball prediction — one that’s expandable to player-level modeling, performance visualization, and potential betting insights.

---
