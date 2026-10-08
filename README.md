# CyberShield — Real-Time Cyber Threat Detection System

[![CyberShield Security SOC](https://img.shields.io/badge/Status-Operational-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/FastAPI-0.104+-009688.svg?logo=fastapi)]()
[![Frontend](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react)]()
[![Database](https://img.shields.io/badge/SQLite-Local-003B57.svg?logo=sqlite)]()
[![License](https://img.shields.io/badge/Simulation-Defensive_Rules-orange.svg)]()

> **Notice:** *DEMO SIMULATION — No real attack is performed. All scenarios evaluate defensive rule-based heuristics safely.*

CyberShield is an enterprise-grade Security Operations Center (SOC) web application built with **React**, **Vite**, **Tailwind CSS**, and **Python FastAPI**. It implements automated defensive threat detection heuristics, safe attack simulations, real-time perimeter monitoring, heuristic payload analysis, and forensic logging.

---

## 🎯 Key Features

1. **Modern Dark SOC Dashboard:**
   - Dark navy palette with cyan, blue, purple, and red accents.
   - Glassmorphism cards with glowing threat indicators.
   - Live KPI cards: Total Threats, Critical Severity Events, Blocked Simulated Attacks, and Suspicious Monitored IPs.
   - Interactive Recharts area chart for activity timeline and pie chart for severity breakdown.
   - Automated polling for real-time telemetry updates.

2. **Defensive Threat Detection Rules Engine:**
   - 0–100 Threat scoring formula with automated severity classification:
     - `0–24`: Low
     - `25–49`: Medium
     - `50–74`: High
     - `75–100`: Critical
   - Evaluates defensive rules including repeated failed logins, volumetric DDoS anomalies, typosquatting domain imitations, binary hash heuristic signatures, impossible travel geo-velocity, and sequential port sweep patterns.
   - Provides detection reasons and actionable defensive mitigation playbooks.

3. **Safe Attack Simulator:**
   - Safe simulated scenarios:
     - **Brute-Force Detection** (Auth Layer)
     - **DDoS Volumetric Traffic Detection** (Layer 7)
     - **Phishing Campaign Detection** (Social Engineering)
     - **Malware Alert Simulation** (Endpoint / EDR)
     - **Suspicious Login Detection** (Identity & Access)
     - **Port-Scan Alert Simulation** (Perimeter Reconnaissance)
   - Interactive parameters (failed attempts, request rates, probe ranges).
   - Generates and writes threat events directly into the local SQLite database.

4. **Defensive AI / Heuristic Payload Scanner:**
   - Deep inspection of arbitrary HTTP payloads, SQL injection tokens, XSS script tags, path traversals, and reverse shells.
   - One-click preset test attacks.
   - Real-time threat gauge and triggered heuristic rules display.

5. **Perimeter IP Monitoring:**
   - Monitored IP nodes with risk scores, reputation ratings, country geolocation, and autonomous system names.
   - Instant ACL policies: Block, Unblock, and Whitelist.

6. **Security Audit & Forensic Logs:**
   - Searchable, filterable event audit log table.
   - JSON export for forensic record-keeping.
   - One-click purge and re-initialization.

7. **System Health & Telemetry:**
   - Live CPU, RAM, and inspection latency benchmarks.
   - Active status check for all 6 defensive modules.

8. **Settings & Policies:**
   - Configurable critical score thresholds and rate-limiting RPM.
   - One-click SQLite database re-seeding.

9. **Authenticated SOC Clearance:**
   - Salted PBKDF2-SHA-256 password verification (never stored in plaintext).
   - Session bearer token management.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **SOC Administrator / CISO** | `admin@cybershield.com` | `admin123` |

> *A convenient "Auto-Fill Demo Credentials" button is provided directly on the login page.*

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 18
  - Vite 5
  - Tailwind CSS 3
  - Lucide React (Icons)
  - Recharts (Interactive Visualizations)
- **Backend:**
  - Python 3.11+
  - FastAPI (ASGI Framework)
  - Uvicorn (Web Server)
  - Pydantic v2
- **Database:**
  - SQLite 3 (`cybershield.db` created automatically on startup)

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
cd cybershield/backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- Backend runs at: `http://localhost:8000`
- Interactive API Docs (Swagger UI): `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd cybershield/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
- Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Validates credentials & issues demo bearer token |
| `GET` | `/api/auth/verify` | Validates current session token |
| `GET` | `/api/dashboard/stats` | Aggregated threat counts, charts, and telemetry |
| `GET` | `/api/threats` | Paginated live threat feed with search & filters |
| `POST` | `/api/threats/{id}/action` | Executes mitigation actions (`block_ip`, `mitigate`, `dismiss`) |
| `POST` | `/api/simulate` | Executes safe attack scenario & persists event |
| `POST` | `/api/analyze` | Deep heuristic scanner on custom payloads |
| `GET` | `/api/ips` | Monitored perimeter IP list & risk scores |
| `POST` | `/api/ips/{ip}/status` | Updates IP firewall status (`Blocked`, `Monitoring`, `Whitelisted`) |
| `GET` | `/api/logs` | Security audit trail logs |
| `POST` | `/api/logs/clear` | Purges audit logs |
| `GET` | `/api/health` | Hardware and rule engine vitals |
| `GET` | `/api/settings` | Retrieves operational thresholds |
| `POST` | `/api/settings` | Updates operational thresholds |
| `POST` | `/api/database/reset` | Re-seeds SQLite database with fresh baseline |

---

## 🛡️ Troubleshooting

1. **Port Conflicts:**
   - If port 8000 is occupied: `uvicorn main:app --port 8080` (and update Vite proxy in `vite.config.js`).
   - If port 5173 is occupied: Vite automatically falls back to 5174.

2. **CORS Issues:**
   - FastAPI backend has CORS middleware configured to allow all origins (`*`) for local pairing.

3. **Database Reset:**
   - Navigate to the **Settings** page in the app and click **Reset DB**, or delete `cybershield.db` and restart the backend.
