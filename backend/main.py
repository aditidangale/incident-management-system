from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from database import SessionLocal, engine
from models import Base, Incident
from datetime import datetime
import threading, time, json

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Incident Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

signal_counter = 0
total_signals = 0

# ---------------- MODELS ----------------

class Signal(BaseModel):
    component_id: str
    severity: str
    message: str

class RCAData(BaseModel):
    root_cause: str
    fix_applied: str
    prevention: str

# ---------------- METRICS ----------------

def print_metrics():
    global signal_counter
    while True:
        time.sleep(5)
        print(f"Signals processed in last 5 sec: {signal_counter}")
        signal_counter = 0

threading.Thread(target=print_metrics, daemon=True).start()

# ---------------- ROOT ----------------

@app.get("/")
def root():
    return {"status": "healthy", "service": "IMS"}

@app.get("/health")
def health():
    return {
        "service": "IMS",
        "database": "connected",
        "status": "healthy",
        "time": str(datetime.utcnow())
    }

# ---------------- GET INCIDENTS ----------------

@app.get("/incidents")
def get_incidents():
    db = SessionLocal()

    rows = db.query(Incident).all()

    result = []

    for row in rows:
        result.append({
            "id": row.id,
            "component_id": row.component_id,
            "severity": row.severity,
            "status": row.status,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "closed_at": row.closed_at.isoformat() if row.closed_at else None,
            "root_cause": row.root_cause,
            "fix_applied": row.fix_applied,
            "prevention": row.prevention
        })

    db.close()

    severity_order = {"P0": 1, "P1": 2, "P2": 3, "P3": 4}

    result.sort(key=lambda x: (
        severity_order.get(x["severity"], 99),
        -x["id"]
    ))

    return result

# ---------------- INGEST ----------------

@app.post("/ingest")
@limiter.limit("10/minute")
def ingest(request: Request, signal: Signal):

    global signal_counter, total_signals

    signal_counter += 1
    total_signals += 1

    db = SessionLocal()

    existing = db.query(Incident).filter(
        Incident.component_id == signal.component_id,
        Incident.status == "OPEN"
    ).first()

    if existing:
        db.close()
        return {"message": "Already Open", "incident_id": existing.id}

    new = Incident(
        component_id=signal.component_id,
        severity=signal.severity,
        status="OPEN",
        created_at=datetime.utcnow()
    )

    db.add(new)
    db.commit()
    db.refresh(new)

    db.close()

    return {"message": "Incident Created", "incident_id": new.id}

# ---------------- RCA ----------------

@app.post("/submit-rca/{incident_id}")
def submit_rca(incident_id: int, data: RCAData):

    db = SessionLocal()

    row = db.query(Incident).filter(Incident.id == incident_id).first()

    if not row:
        db.close()
        return {"error": "Not Found"}

    row.root_cause = data.root_cause
    row.fix_applied = data.fix_applied
    row.prevention = data.prevention

    db.commit()
    db.close()

    return {"message": "RCA Saved"}

# ---------------- STATUS ----------------

@app.put("/update-status/{incident_id}")
def update_status(incident_id: int, new_status: str):

    db = SessionLocal()

    row = db.query(Incident).filter(Incident.id == incident_id).first()

    if not row:
        db.close()
        return {"error": "Not Found"}

    row.status = new_status

    if new_status == "CLOSED":
        row.closed_at = datetime.utcnow()

    db.commit()
    db.close()

    return {"message": "Updated"}