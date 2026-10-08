# CyberShield — Real-Time Cyber Threat Detection System

[![CyberShield Security SOC](https://img.shields.io/badge/Status-Operational-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/FastAPI-0.104+-009688.svg?logo=fastapi)]()
[![Frontend](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react)]()
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-blue.svg)]()
[![Database](https://img.shields.io/badge/SQLite-Resilient_AutoSeed-003B57.svg?logo=sqlite)]()

> **Notice:** *DEMO SIMULATION — No real attack is performed. All scenarios evaluate defensive rule-based heuristics safely.*

CyberShield is an enterprise-grade Security Operations Center (SOC) web application built with **React**, **Vite**, **Tailwind CSS**, and **Python FastAPI**. It implements automated defensive threat detection heuristics, safe attack simulations, real-time perimeter monitoring, heuristic payload analysis, and forensic logging.

---

## 🎯 Architecture & Project Inspection

* **Frontend:** `frontend/` (React 18 + Vite 5 + Tailwind CSS + Lucide React + Recharts)
* **Backend:** `backend/` (Python 3.11 + FastAPI + Uvicorn + Pydantic v2)
* **Database:** SQLite 3 (`backend/cybershield.db` with auto-seeding on startup)
* **Environment Variables:**
  * **Frontend:** `VITE_API_URL` (Base backend URL, e.g., `https://cybershield-backend.onrender.com`)
  * **Backend:** `PORT` (Dynamic server port assigned by Render/Railway) and `CORS_ORIGINS` (Allowed origins, defaults to `*`)
* **API URLs:** Fully decoupled using `import.meta.env.VITE_API_URL` with runtime fallback in `frontend/src/services/api.js`. Zero hardcoded `localhost` references in production code.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **SOC Administrator / CISO** | `admin@cybershield.com` | `admin123` |

> *A convenient "Auto-Fill Demo Credentials" button is provided directly on the login screen.*

---

## 🚀 Production Deployment Guide

### A. Deploy Backend to Render

1. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/<your-username>/cybershield.git
   git push -u origin main
   ```

2. **Create Web Service on Render:**
   * Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
   * Connect your `cybershield` GitHub repository.
   * Configure the settings:
     * **Name:** `cybershield-backend`
     * **Root Directory:** `backend`
     * **Runtime:** `Python 3`
     * **Build Command:** `pip install -r requirements.txt`
     * **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
     * **Plan:** `Free`
   * Click **Create Web Service**.
   * Once deployed, Render will provide your public backend URL, e.g.:
     `https://cybershield-backend.onrender.com`

> **Note on SQLite on Render Free Tier:**
> Render Free Web Services use an ephemeral filesystem that re-creates on spin-down. CyberShield is designed with resilient auto-initialization: whenever the backend boots, `init_db()` automatically provisions the SQLite schema and seeds realistic baseline events, logs, and monitored IPs. Your demo functionality is guaranteed to stay 100% operational!

---

### B. Deploy Frontend to Vercel

1. **Import Project to Vercel:**
   * Go to [Vercel Dashboard](https://vercel.com/) and click **Add New... > Project**.
   * Import your `cybershield` GitHub repository.

2. **Configure Project Settings:**
   * **Framework Preset:** `Vite`
   * **Root Directory:** Click `Edit` and select `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`

3. **Add Environment Variable:**
   * Expand **Environment Variables**:
     * **Key:** `VITE_API_URL`
     * **Value:** `https://cybershield-backend.onrender.com` (Your Render URL from Step A)
   * Click **Deploy**.

4. **Your Public App is Live:**
   * Vercel will deploy your application to a public HTTPS URL:
     `https://cybershield.vercel.app` (or your assigned project name).

---

### C. Live Backend Switcher & Verification

* In the deployed application, navigate to **Settings > Production Backend Connection**.
* You can test the connection in real time using the **Test Connection** button.
* If you ever change backend hosts, you can update the backend URL directly in the UI without redeploying.

---

## 💻 Local Testing & Wi-Fi Network Access

### Running Locally:
1. **Backend:**
   ```bash
   cd backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm run preview -- --host 0.0.0.0 --port 5173
   ```

### Accessing from Other Laptops & Mobile Phones (Local Wi-Fi):
Both servers bind to `0.0.0.0`, allowing other devices on the same Wi-Fi network to access CyberShield using your computer's local IP:
* **Frontend:** `http://<your-local-ip>:5173`
* **Backend:** `http://<your-local-ip>:8000`
