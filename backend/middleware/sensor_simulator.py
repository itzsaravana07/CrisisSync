"""
CrisisSync AI — Sensor Simulator (Middleware Version 1.1)
Simulates IoT/sensor edge devices by POSTing incident rows
directly to Supabase using only the anon key.
"""

import os
import json
import time
import random
import httpx
from dotenv import load_dotenv

# Load from .env.local or environment
load_dotenv(dotenv_path="../.env.local")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

# UUIDs from seed.sql
SENSOR_IDS = {
    "smoke":   "a1111111-a111-a111-a111-a11111111111",
    "audio":   "a3333333-a333-a333-a333-a33333333333",
    "seismic": "a5555555-a555-a555-a555-a55555555555",
    "cctv":    "a2222222-a222-a222-a222-a22222222222",
    "manual":  "a4444444-a444-a444-a444-a44444444444",
}

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

def fire_incident(sensor_type: str, payload: dict) -> dict:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set in .env.local")
        return {}

    body = {
        "sensor_id": SENSOR_IDS[sensor_type],
        "raw_payload": payload,
    }

    try:
        response = httpx.post(
            f"{SUPABASE_URL}/rest/v1/incidents",
            headers=HEADERS,
            json=body,
            timeout=10,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Failed to fire incident: {e}")
        return {}

def simulate_smoke_event():
    print("🔥 Simulating Smoke Detection in Kitchen...")
    return fire_incident("smoke", {
        "type": "smoke",
        "ppm": random.randint(800, 1200),
        "temperature": "82C",
        "context": "Rapid rise detected"
    })

def simulate_audio_event():
    print("🔊 Simulating Panic Audio in Lobby...")
    return fire_incident("audio", {
        "type": "audio",
        "decibels": 110,
        "classification": "high_stress_vocalisation",
        "confidence": 0.94
    })

if __name__ == "__main__":
    print("🚨 CrisisSync Middleware Simulator Starting...")
    simulate_smoke_event()
    time.sleep(5)
    simulate_audio_event()
    print("Done.")
