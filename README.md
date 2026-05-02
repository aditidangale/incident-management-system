# 🚀 Incident Management System (IMS)

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)
![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A production-style **Infrastructure / SRE Incident Management Dashboard** built using **FastAPI + React**.
This project simulates real-world incident workflows such as alert ingestion, prioritization, status tracking, RCA submissions, health checks, metrics, and live dashboard monitoring.

---

## 📌 Table of Contents

* Overview
* Features
* Tech Stack
* Project Structure
* Architecture Diagram
* Local Setup
* Docker Setup
* API Endpoints
* Backpressure Handling
* Sample Failure Simulation
* Security Improvements
* Performance Optimizations
* Screenshots
* Future Enhancements
* GitHub Submission Checklist

---

## 🧩 Overview

Modern production teams need systems to quickly manage incidents affecting infrastructure, services, and applications.

This project provides:

* Signal ingestion from monitored components
* Auto incident creation
* Duplicate alert suppression
* Priority handling (P0 / P1 / P2 / P3)
* Incident lifecycle management
* RCA submission before closure
* Live dashboard updates
* Metrics and health monitoring

---

## ✨ Features

### Backend

* FastAPI REST APIs
* SQLite database
* Rate limiting
* CORS enabled
* Health endpoint
* Metrics endpoint
* RCA enforcement before close
* Duplicate OPEN incident prevention
* Raw signal logging

### Frontend

* Professional React dashboard
* Auto refresh
* Incident cards
* Severity color coding
* Click row → details panel
* RCA form
* Saved RCA display
* Responsive UI

---

## 🛠 Tech Stack

| Layer      | Technology         |
| ---------- | ------------------ |
| Frontend   | React + Vite       |
| Backend    | FastAPI            |
| Database   | SQLite             |
| ORM        | SQLAlchemy         |
| Validation | Pydantic           |
| Security   | SlowAPI Rate Limit |
| Deployment | Docker Compose     |

---

## 📁 Project Structure

```text
IMS-Assi/
│── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
│
│── frontend/
│   ├── src/App.jsx
│   ├── package.json
│   └── Dockerfile
│
│── docker-compose.yml
│── README.md
│── sample_data.json
```

---

## 🏗 Architecture Diagram

```text
                +-------------------+
                |   React Frontend  |
                | Dashboard (5173)  |
                +---------+---------+
                          |
                          v
                +-------------------+
                |   FastAPI Backend |
                | APIs (8000)       |
                +---------+---------+
                          |
                          v
                +-------------------+
                |     SQLite DB     |
                | incidents table   |
                +-------------------+
```

---

# ⚙️ Local Setup

## 1️⃣ Clone Repository

```bash
git clone <your-github-link>
cd IMS-Assi
```

---

## 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URL:

**http://127.0.0.1:8000**

Swagger Docs:

**http://127.0.0.1:8000/docs**

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

**http://localhost:5173**

---

# 🐳 Docker Setup

Run full project:

```bash
docker-compose up --build
```

Then open:

* Frontend → http://localhost:5173
* Backend → http://localhost:8000/docs

---

# 🔌 API Endpoints

| Method | Endpoint            | Purpose           |
| ------ | ------------------- | ----------------- |
| GET    | /                   | Root              |
| GET    | /health             | Health Check      |
| GET    | /metrics            | Dashboard Metrics |
| GET    | /incidents          | Get All Incidents |
| POST   | /ingest             | Create Incident   |
| PUT    | /update-status/{id} | Update Status     |
| POST   | /submit-rca/{id}    | Submit RCA        |
| GET    | /incident/{id}      | Incident Details  |

---

# 🌊 Backpressure Handling

To handle excessive incoming alerts/signals:

### Implemented:

* SlowAPI Rate Limit: `10 requests/minute`
* Duplicate OPEN incident suppression
* Lightweight SQLite writes
* Async-ready FastAPI architecture

### Why Important?

Prevents system overload during outage storms.

---

# 🧪 Sample Failure Simulation

Use this JSON:

```json
[
  {
    "component_id": "DB_PRIMARY",
    "severity": "P0",
    "message": "Database unreachable"
  },
  {
    "component_id": "MCP_SERVICE",
    "severity": "P1",
    "message": "Control plane degraded"
  }
]
```

POST to:

```bash
http://127.0.0.1:8000/ingest
```

---

# 🔐 Security Improvements

Implemented:

* CORS restrictions
* Request validation using Pydantic
* Rate limiting
* Controlled status transitions
* RCA required before closure

Future:

* JWT Authentication
* Role-based access
* Audit logs

---

# ⚡ Performance Optimizations

* Auto refresh every 10 sec
* Efficient sorting
* Minimal DB overhead
* Clean React state handling
* FastAPI high throughput

---



# 🚀 Future Enhancements

* Search & Filters
* Email / Slack alerts
* Multi-user auth
* PostgreSQL support
* Charts / Grafana integration
* Incident timeline
* Notes/comments system

---

# ✅ GitHub Submission Checklist

* [x] Running Application
* [x] Frontend + Backend
* [x] Docker Compose
* [x] README Included
* [x] Architecture Diagram
* [x] Backpressure Section
* [x] Sample Data
* [x] Metrics
* [x] Security Enhancements

---

# 👩‍💻 Author

**Aditi Anand Dangale**

GitHub: `https://github.com/aditidangale/incident-management-system`

---

# 📌 Final Notes

This assignment was built with focus on:

* Reliability
* Observability
* Scalability mindset
* Real SRE workflows
* Clean UI/UX
* Production thinking

---
