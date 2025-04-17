# db.py
import psycopg2
import os
import json

DB_URL = os.getenv("NEON_DB_URL")

def get_connection():
    return psycopg2.connect(DB_URL)

def init_db():
    print(f"[DB] Connecting to {DB_URL}")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            date TEXT PRIMARY KEY,
            result JSONB
        );
    """)
    conn.commit()
    conn.close()

def save_prediction(date_str, result):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO predictions (date, result) VALUES (%s, %s) ON CONFLICT (date) DO UPDATE SET result = EXCLUDED.result;",
        (date_str, json.dumps(result))
    )
    conn.commit()
    conn.close()

def load_prediction(date_str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT result FROM predictions WHERE date = %s", (date_str,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None
