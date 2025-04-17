# CourtVision

> A full-stack NBA game prediction app using real-time data, injury reports, and machine learning.

CourtVision is an expansion of my original [NBA prediction model](https://github.com/al3jandroR/nba_predictions), which was developed as a class project in Google Colab using team statistics and classification models. This app takes that foundation and evolves it into a production-style web application.

---

## What It Does

CourtVision predicts NBA game outcomes using:
- Rolling team performance metrics (5-game averages)
- Real-time injury reports and player availability
- Opponent-based matchup features
- A trained ML model (Random Forest / Gradient Boosting)
- Caching of predictions in a PostgreSQL database (via Neon)

---

## Stack Overview

| Layer        | Tech                                 |
|--------------|--------------------------------------|
| Backend      | Python, FastAPI                      |
| ML Model     | scikit-learn (.pkl)                  |
| Data Source  | [nba_api](https://github.com/swar/nba_api) |
| Database     | Neon (PostgreSQL) for caching        |
| Frontend     | React (Vite)                         |
| Deployment   | Fly.io (API) + Vercel (UI)           |
| Extras       | GitHub Actions for daily caching + warming bot |

---

## Features

✅ FastAPI backend with preloaded model  
✅ Caching of predictions by date using PostgreSQL  
✅ Auto-fetching and retry logic to wake sleeping API  
✅ Clean, auto-loading React UI with error handling  
✅ GitHub Action to auto-fetch & cache today’s prediction

---

## In Progress

🛠 Frontend UX polish (better loading/feedback)  
🛠 Past game analytics and player-level expansion  
🛠 Optional login + favorites tracking  

---

## Original Model

The ML model powering this app was first built here:  
[nba-predictions](https://github.com/al3jandroR/nba_predictions)

---

## Goal

To build a clean, interactive, data-driven web app for NBA predictions — one that’s expandable to include player projections, matchup visualizations, and betting market analysis.

---
