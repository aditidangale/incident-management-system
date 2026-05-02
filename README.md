Incident Management System (IMS)

Overview
This project is an Infrastructure / SRE Incident Management System built using:
FastAPI (Backend)
React + Vite (Frontend)
SQLite Database
Axios API Calls

Features
Create incidents via /ingest API
Real-time Dashboard
Incident Severity Tracking (P0/P1/P2/P3)
Status Management (OPEN / INVESTIGATING / RESOLVED / CLOSED)
RCA Submission
Metrics Endpoint
Health Check Endpoint
Auto Refresh Dashboard
Rate Limiting using SlowAPI
CORS Enabled
SQLite Persistent Storage


Security Enhancements
API Rate Limiting
CORS Restriction
Input Validation using Pydantic


Performance Improvements
Auto refresh every 10 sec
Optimized frontend rendering
FastAPI lightweight backend


Run Project
Backend
source venv/bin/activate uvicorn main:app --reload

Frontend
npm install npm run dev

GitHub Repository
https://github.com/aditidangale/incident-management-system