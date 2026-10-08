import os
import json
import random
import time
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Header, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import init_db, get_db
from rules_engine import DefensiveRulesEngine, calculate_severity
from auth import verify_credentials, create_session_token, validate_token, DEMO_EMAIL

# Initialize database on startup
init_db()

app = FastAPI(
    title="CyberShield — Real-Time Cyber Threat Detection System",
    description="Backend API powering defensive threat detection, heuristic rule engine, attack simulation, and SOC telemetry.",
    version="1.0.0"
)

# Enable CORS for frontend (production Vercel, localhost, and custom domains)
allowed_origins = [
    "https://frontend-xi-five-67.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]
cors_origins_env = os.environ.get("CORS_ORIGINS", "")
if cors_origins_env:
    for o in cors_origins_env.split(","):
        clean_o = o.strip()
        if clean_o and clean_o not in allowed_origins:
            allowed_origins.append(clean_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CyberShield Defensive Threat Detection API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "notice": "DEMO SIMULATION — Defensive Rule-Based Detection Active."
    }

# ----------------- Request / Response Models -----------------

class LoginRequest(BaseModel):
    email: str
    password: str

class SimulateRequest(BaseModel):
    scenario: str = Field(..., description="Scenario type: brute_force, ddos, phishing, malware, suspicious_login, port_scan")
    custom_params: Optional[Dict[str, Any]] = None

class AnalyzeRequest(BaseModel):
    payload: str
    source_ip: Optional[str] = "192.168.1.100"
    request_rate: Optional[int] = 15
    save_to_feed: Optional[bool] = True

class ThreatActionRequest(BaseModel):
    action: str = Field(..., description="Action: 'block_ip', 'mitigate', 'dismiss'")

class IPStatusRequest(BaseModel):
    status: str = Field(..., description="'Blocked', 'Monitoring', 'Whitelisted'")

class SettingsUpdateRequest(BaseModel):
    settings: Dict[str, str]

# ----------------- Dependency -----------------

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        # In demo environment, allow read access if unauthenticated,
        # but mark as unauthenticated for sensitive operations
        return None
    token = authorization.replace("Bearer ", "").strip()
    user = validate_token(token)
    return user

# ----------------- Authentication Endpoints -----------------

@app.post("/api/auth/login")
def login(req: LoginRequest):
    if not verify_credentials(req.email, req.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid security credentials. Use demo account: admin@cybershield.com / admin123"
        )
    
    token = create_session_token(req.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": DEMO_EMAIL,
            "role": "Chief Information Security Officer (CISO)",
            "name": "SOC Administrator",
            "demo_notice": "DEMO AUTHENTICATION — Running with sandboxed role-based permissions."
        }
    }

@app.get("/api/auth/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    token = authorization.replace("Bearer ", "").strip()
    session = validate_token(token)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return {"valid": True, "user": session}

# ----------------- Dashboard Statistics Endpoint -----------------

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    conn = get_db()
    cursor = conn.cursor()

    # Total detected threats
    cursor.execute("SELECT COUNT(*) FROM threat_events")
    total_threats = cursor.fetchone()[0]

    # Critical threats
    cursor.execute("SELECT COUNT(*) FROM threat_events WHERE severity = 'Critical'")
    critical_threats = cursor.fetchone()[0]

    # Blocked simulated attacks
    cursor.execute("SELECT COUNT(*) FROM threat_events WHERE status = 'Blocked'")
    blocked_attacks = cursor.fetchone()[0]

    # High severity
    cursor.execute("SELECT COUNT(*) FROM threat_events WHERE severity = 'High'")
    high_threats = cursor.fetchone()[0]

    # Medium severity
    cursor.execute("SELECT COUNT(*) FROM threat_events WHERE severity = 'Medium'")
    medium_threats = cursor.fetchone()[0]

    # Low severity
    cursor.execute("SELECT COUNT(*) FROM threat_events WHERE severity = 'Low'")
    low_threats = cursor.fetchone()[0]

    # Suspicious & Blocked IPs
    cursor.execute("SELECT COUNT(*) FROM monitored_ips WHERE status = 'Blocked' OR risk_score >= 60")
    suspicious_ips = cursor.fetchone()[0]

    # Severity distribution
    severity_distribution = [
        {"name": "Critical", "value": critical_threats, "color": "#ef4444"},
        {"name": "High", "value": high_threats, "color": "#f97316"},
        {"name": "Medium", "value": medium_threats, "color": "#eab308"},
        {"name": "Low", "value": low_threats, "color": "#06b6d4"}
    ]

    # Threats by category
    cursor.execute("""
        SELECT type, COUNT(*) as count 
        FROM threat_events 
        GROUP BY type 
        ORDER BY count DESC 
        LIMIT 6
    """)
    category_rows = cursor.fetchall()
    categories = [{"category": row["type"], "count": row["count"]} for row in category_rows]

    # Activity Timeline (simulated 24 hour trend with real database counts)
    timeline = []
    base_hours = [
        "00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "Now"
    ]
    for idx, hour in enumerate(base_hours):
        # generate realistic trend points centered around live threat count
        mult = (idx + 1) / len(base_hours)
        timeline.append({
            "time": hour,
            "threats": max(2, int(total_threats * mult * 0.4 + random.randint(1, 4))),
            "blocked": max(1, int(blocked_attacks * mult * 0.35 + random.randint(0, 2))),
            "inspected": int(total_threats * mult * 18 + random.randint(20, 60))
        })

    # Recent 5 events for fast dashboard preview
    cursor.execute("""
        SELECT id, type, severity, threat_score, source_ip, status, timestamp, detection_reason
        FROM threat_events
        ORDER BY id DESC
        LIMIT 5
    """)
    recent_events = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "total_threats": total_threats,
        "critical_threats": critical_threats,
        "blocked_attacks": blocked_attacks,
        "suspicious_ips": suspicious_ips,
        "system_protection_status": "Shield Active (Level 4 Defensive Guard)",
        "active_defensive_rules": 6,
        "uptime_percentage": "99.98%",
        "threat_distribution": severity_distribution,
        "threat_categories": categories,
        "activity_timeline": timeline,
        "recent_events": recent_events,
        "notice": "DEMO SIMULATION — Defensive Rule-Based Detection Active."
    }

# ----------------- Threat Events API -----------------

@app.get("/api/threats")
def get_threats(
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0)
):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM threat_events WHERE 1=1"
    params = []

    if severity and severity.lower() != "all":
        query += " AND severity = ?"
        params.append(severity)

    if status and status.lower() != "all":
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND (type LIKE ? OR source_ip LIKE ? OR detection_reason LIKE ? OR target_endpoint LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    threats = [dict(row) for row in rows]

    # Total count for pagination
    count_query = "SELECT COUNT(*) FROM threat_events WHERE 1=1"
    count_params = []
    if severity and severity.lower() != "all":
        count_query += " AND severity = ?"
        count_params.append(severity)
    if status and status.lower() != "all":
        count_query += " AND status = ?"
        count_params.append(status)
    if search:
        count_query += " AND (type LIKE ? OR source_ip LIKE ? OR detection_reason LIKE ? OR target_endpoint LIKE ?)"
        wildcard = f"%{search}%"
        count_params.extend([wildcard, wildcard, wildcard, wildcard])

    cursor.execute(count_query, count_params)
    total_count = cursor.fetchone()[0]

    conn.close()
    return {"total": total_count, "items": threats}

@app.post("/api/threats/{threat_id}/action")
def update_threat_action(threat_id: int, req: ThreatActionRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM threat_events WHERE id = ?", (threat_id,))
    threat = cursor.fetchone()
    if not threat:
        conn.close()
        raise HTTPException(status_code=404, detail="Threat event not found")

    new_status = "Active"
    log_msg = ""
    ip = threat["source_ip"]

    if req.action == "block_ip":
        new_status = "Blocked"
        log_msg = f"Security analyst manually enforced firewall block on IP {ip} following threat #{threat_id}."
        # Update monitored_ips table
        cursor.execute("""
            INSERT INTO monitored_ips (ip_address, risk_score, reputation, country, asn_org, requests_per_min, status, last_seen)
            VALUES (?, 95, 'Malicious', 'Perimeter Blacklist', 'Custom Rule Block', 0, 'Blocked', ?)
            ON CONFLICT(ip_address) DO UPDATE SET status='Blocked', risk_score=95
        """, (ip, datetime.utcnow().isoformat() + "Z"))

    elif req.action == "mitigate":
        new_status = "Mitigated"
        log_msg = f"Threat event #{threat_id} successfully mitigated by defensive containment playbook."
    elif req.action == "dismiss":
        new_status = "Dismissed"
        log_msg = f"Threat event #{threat_id} marked as dismissed/false positive after verification."

    cursor.execute("UPDATE threat_events SET status = ? WHERE id = ?", (new_status, threat_id))

    # Append security log
    cursor.execute("""
        INSERT INTO security_logs (event_type, severity, source_ip, message, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, ("SOC Analyst Action", "Medium", ip, log_msg, datetime.utcnow().isoformat() + "Z"))

    conn.commit()
    conn.close()

    return {"success": True, "threat_id": threat_id, "new_status": new_status, "message": log_msg}

# ----------------- Attack Simulator Endpoint -----------------

@app.post("/api/simulate")
def simulate_attack(req: SimulateRequest):
    """
    Safe Attack Simulator:
    Analyzes scenario using defensive detection rules, assigns threat score & severity,
    saves the event in SQLite, returns detection result, adds log and live threat feed event.
    "DEMO SIMULATION — No real attack is performed."
    """
    valid_scenarios = ["brute_force", "ddos", "phishing", "malware", "suspicious_login", "port_scan"]
    if req.scenario not in valid_scenarios:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid scenario. Supported: {', '.join(valid_scenarios)}"
        )

    # Execute defensive rules engine
    result = DefensiveRulesEngine.evaluate_scenario(req.scenario, req.custom_params)

    # Persist in SQLite
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO threat_events (
            type, severity, threat_score, source_ip, target_endpoint,
            detection_reason, recommended_action, status, is_simulated, details, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        result["type"],
        result["severity"],
        result["threat_score"],
        result["source_ip"],
        result["target_endpoint"],
        result["detection_reason"],
        result["recommended_action"],
        result["status"],
        1,
        json.dumps(result["details"]),
        result["timestamp"]
    ))
    threat_id = cursor.lastrowid

    # Add security log
    log_msg = f"Defensive Engine triggered for simulated {result['type']} from {result['source_ip']} (Score: {result['threat_score']}/100, Severity: {result['severity']}). Action: {result['recommended_action'][:100]}..."
    cursor.execute("""
        INSERT INTO security_logs (event_type, severity, source_ip, message, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (
        "Simulated Threat Intercepted",
        result["severity"],
        result["source_ip"],
        log_msg,
        result["timestamp"]
    ))

    # Add/Update Monitored IP if high risk
    reputation = "Malicious" if result["threat_score"] >= 75 else "Suspicious" if result["threat_score"] >= 45 else "Neutral"
    ip_status = "Blocked" if result["status"] == "Blocked" else "Monitoring"
    cursor.execute("""
        INSERT INTO monitored_ips (ip_address, risk_score, reputation, country, asn_org, requests_per_min, status, last_seen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(ip_address) DO UPDATE SET 
            risk_score=excluded.risk_score,
            status=excluded.status,
            last_seen=excluded.last_seen
    """, (
        result["source_ip"],
        result["threat_score"],
        reputation,
        "Simulated Attack Origin",
        "Autonomous Simulation Node",
        random.randint(60, 1800),
        ip_status,
        result["timestamp"]
    ))

    conn.commit()
    conn.close()

    result["id"] = threat_id
    return result

# ----------------- Deep AI/Rule Threat Analysis Endpoint -----------------

@app.post("/api/analyze")
def analyze_threat(req: AnalyzeRequest):
    """
    Defensive Threat Analysis:
    Runs deep rule-based heuristic inspection on custom user inputs, queries, or payloads.
    Calculates threat score (0-100), severity, triggered rules, and mitigation playbook.
    """
    result = DefensiveRulesEngine.analyze_custom_input(
        payload_text=req.payload,
        ip_address=req.source_ip or "192.168.1.100",
        request_rate=req.request_rate or 15
    )

    if req.save_to_feed and result["threat_score"] >= 25:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO threat_events (
                type, severity, threat_score, source_ip, target_endpoint,
                detection_reason, recommended_action, status, is_simulated, details, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            result["type"],
            result["severity"],
            result["threat_score"],
            result["source_ip"],
            result["target_endpoint"],
            result["detection_reason"],
            result["recommended_action"],
            result["status"],
            1,
            json.dumps(result["details"]),
            result["timestamp"]
        ))
        threat_id = cursor.lastrowid
        result["id"] = threat_id

        # Also log
        cursor.execute("""
            INSERT INTO security_logs (event_type, severity, source_ip, message, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "Payload Analysis Triggered",
            result["severity"],
            result["source_ip"],
            f"Heuristic scanner parsed payload: {result['detection_reason'][:120]}...",
            result["timestamp"]
        ))
        conn.commit()
        conn.close()

    return result

# ----------------- IP Monitoring Endpoints -----------------

@app.get("/api/ips")
def get_monitored_ips(search: Optional[str] = None, status: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM monitored_ips WHERE 1=1"
    params = []

    if status and status.lower() != "all":
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND (ip_address LIKE ? OR country LIKE ? OR asn_org LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard])

    query += " ORDER BY risk_score DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    ips = [dict(row) for row in rows]
    conn.close()

    return {"total": len(ips), "items": ips}

@app.post("/api/ips/{ip_address}/status")
def update_ip_status(ip_address: str, req: IPStatusRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM monitored_ips WHERE ip_address = ?", (ip_address,))
    row = cursor.fetchone()
    if not row:
        # Create it
        cursor.execute("""
            INSERT INTO monitored_ips (ip_address, risk_score, reputation, country, asn_org, requests_per_min, status, last_seen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ip_address,
            90 if req.status == "Blocked" else 10,
            "Malicious" if req.status == "Blocked" else "Neutral",
            "Manual Entry",
            "User Designated",
            0,
            req.status,
            datetime.utcnow().isoformat() + "Z"
        ))
    else:
        cursor.execute("""
            UPDATE monitored_ips 
            SET status = ?, last_seen = ? 
            WHERE ip_address = ?
        """, (req.status, datetime.utcnow().isoformat() + "Z", ip_address))

    # Log action
    cursor.execute("""
        INSERT INTO security_logs (event_type, severity, source_ip, message, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (
        "IP Policy Change",
        "High" if req.status == "Blocked" else "Low",
        ip_address,
        f"IP address {ip_address} policy status changed to '{req.status}'.",
        datetime.utcnow().isoformat() + "Z"
    ))

    conn.commit()
    conn.close()

    return {"success": True, "ip_address": ip_address, "new_status": req.status}

# ----------------- Security Logs Endpoints -----------------

@app.get("/api/logs")
def get_security_logs(
    severity: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM security_logs WHERE 1=1"
    params = []

    if severity and severity.lower() != "all":
        query += " AND severity = ?"
        params.append(severity)

    if search:
        query += " AND (message LIKE ? OR event_type LIKE ? OR source_ip LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard])

    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    logs = [dict(row) for row in rows]

    cursor.execute("SELECT COUNT(*) FROM security_logs")
    total_count = cursor.fetchone()[0]

    conn.close()
    return {"total": total_count, "items": logs}

@app.post("/api/logs/clear")
def clear_security_logs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM security_logs")
    # Insert fresh cleared log
    now_iso = datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
        INSERT INTO security_logs (event_type, severity, source_ip, message, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, ("Audit Log Purge", "Low", "127.0.0.1", "Security event logs successfully archived and cleared by Administrator.", now_iso))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Security logs successfully cleared."}

# ----------------- System Health Endpoint -----------------

@app.get("/api/health")
def get_system_health():
    # Dynamic realistic health telemetry
    return {
        "status": "HEALTHY",
        "protection_status": "Shield Active (Heuristic Guard)",
        "cpu_usage_pct": round(random.uniform(14.2, 28.5), 1),
        "ram_usage_pct": round(random.uniform(41.0, 52.3), 1),
        "disk_io_pct": round(random.uniform(8.1, 19.4), 1),
        "active_defensive_rules": 6,
        "average_inspection_latency_ms": round(random.uniform(1.2, 3.8), 2),
        "network_throughput_mbps": round(random.uniform(45.0, 112.4), 1),
        "database_storage": "SQLite Local (Active)",
        "backend_version": "CyberShield Engine v1.0.0",
        "rule_engine_status": "Operational (Defensive Mode)",
        "last_health_check": datetime.utcnow().isoformat() + "Z",
        "notice": "DEMO SIMULATION — No real attack is performed."
    }

# ----------------- Settings Endpoints -----------------

@app.get("/api/settings")
def get_settings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM system_settings")
    rows = cursor.fetchall()
    settings = {row["key"]: row["value"] for row in rows}
    conn.close()
    return settings

@app.post("/api/settings")
def update_settings(req: SettingsUpdateRequest):
    conn = get_db()
    cursor = conn.cursor()
    for k, v in req.settings.items():
        cursor.execute("""
            INSERT INTO system_settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """, (k, str(v)))
    conn.commit()
    conn.close()
    return {"success": True, "updated": req.settings}

# ----------------- Database Reset Endpoint -----------------

@app.post("/api/database/reset")
def reset_database():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS threat_events")
    cursor.execute("DROP TABLE IF EXISTS security_logs")
    cursor.execute("DROP TABLE IF EXISTS monitored_ips")
    cursor.execute("DROP TABLE IF EXISTS system_settings")
    conn.commit()
    conn.close()
    init_db()
    return {"success": True, "message": "Database refreshed with fresh seed demo dataset."}

if __name__ == "__main__":
    import uvicorn
    # Support Render / Railway dynamic $PORT
    port = int(os.environ.get("PORT", 8000))
    print(f"[*] Starting CyberShield Backend on 0.0.0.0:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

