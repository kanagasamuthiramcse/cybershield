import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "cybershield.db"))

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Threat Events table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS threat_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        threat_score INTEGER NOT NULL,
        source_ip TEXT NOT NULL,
        target_endpoint TEXT NOT NULL,
        detection_reason TEXT NOT NULL,
        recommended_action TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        is_simulated INTEGER NOT NULL DEFAULT 1,
        details TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    # Security Logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        source_ip TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)

    # Monitored IPs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS monitored_ips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT UNIQUE NOT NULL,
        risk_score INTEGER NOT NULL,
        reputation TEXT NOT NULL,
        country TEXT NOT NULL,
        asn_org TEXT NOT NULL,
        requests_per_min INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Monitoring',
        last_seen TEXT NOT NULL
    )
    """)

    # System Settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)

    # Check if seed data exists
    cursor.execute("SELECT COUNT(*) FROM threat_events")
    count = cursor.fetchone()[0]

    if count == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    now = datetime.utcnow()

    # Initial Threat Events
    initial_threats = [
        (
            "Brute-force Attempt",
            "Critical",
            88,
            "185.220.101.5",
            "/api/auth/login",
            "Observed 28 consecutive failed authentication queries within a 30-second window targeting admin user accounts.",
            "Enforce IP drop rule via edge firewall and trigger step-up multi-factor biometric challenge.",
            "Blocked",
            1,
            json.dumps({"failed_attempts": 28, "target_user": "admin", "protocol": "HTTPS"}),
            (now - timedelta(minutes=12)).isoformat() + "Z"
        ),
        (
            "DDoS Traffic Spike",
            "Critical",
            94,
            "45.142.195.88",
            "/api/v1/gateway",
            "Abnormal volumetric HTTP GET flood exceeding baseline traffic by 650% (2,840 req/sec).",
            "Engage Cloudflare Under-Attack mitigation, rate limit ASN 49505, and drop non-whitelisted SYN packets.",
            "Active",
            1,
            json.dumps({"peak_rps": 2840, "attack_type": "HTTP Flood", "bandwidth": "1.4 Gbps"}),
            (now - timedelta(minutes=24)).isoformat() + "Z"
        ),
        (
            "Port Scan Activity",
            "High",
            68,
            "194.26.29.112",
            "Port Range [21-8080]",
            "Rapid sequential TCP SYN probes detected scanning 1,024 ports across host boundary.",
            "Drop ingress TCP handshakes and inject dynamic blackhole route across local routing table.",
            "Mitigated",
            1,
            json.dumps({"ports_scanned": 1024, "scan_technique": "TCP SYN Stealth", "duration": "4.2s"}),
            (now - timedelta(hours=1, minutes=10)).isoformat() + "Z"
        ),
        (
            "Phishing Campaign",
            "High",
            72,
            "103.145.13.204",
            "/secure-login-portal/verify",
            "Host identified serving deceptive typosquatted landing page mimicking organization single-sign-on.",
            "Push domain to DNS RPZ sinkhole, update browser reputation feeds, and revoke potentially compromised session tokens.",
            "Investigating",
            1,
            json.dumps({"deceptive_domain": "login-cybershield-auth.net", "ssl_issuer": "Let's Encrypt Free"}),
            (now - timedelta(hours=2, minutes=5)).isoformat() + "Z"
        ),
        (
            "Malware Alert",
            "Critical",
            96,
            "91.240.118.172",
            "/uploads/agent_update.bin",
            "Payload matched signature for Cobalt Strike beacon staging payload (SHA-256 match in heuristic rule DB).",
            "Isolate compromised host endpoint to quarantine VLAN, kill process PID 4912, and preserve memory artifact.",
            "Blocked",
            1,
            json.dumps({"signature": "Win32/CobaltStrike.Stager.Gen", "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}),
            (now - timedelta(hours=3, minutes=45)).isoformat() + "Z"
        ),
        (
            "Suspicious Geo-Location Login",
            "Medium",
            42,
            "103.251.167.20",
            "/api/auth/session",
            "Login originating from unexpected autonomous system (ASN 133215) outside habitual user profile within 2 hours of local session.",
            "Force session invalidation, notify account holder via push notification, and require re-authentication.",
            "Mitigated",
            1,
            json.dumps({"origin_country": "Singapore", "habitual_country": "United States", "time_delta": "45 mins"}),
            (now - timedelta(hours=5)).isoformat() + "Z"
        ),
        (
            "Abnormal Request Frequency",
            "Medium",
            38,
            "178.62.204.14",
            "/api/data/export",
            "Client sending persistent recurring queries at uniform 50ms intervals suggesting automated headless scraper.",
            "Enforce JavaScript challenge proof-of-work and throttle token bucket to 5 requests per minute.",
            "Active",
            1,
            json.dumps({"user_agent": "python-requests/2.31.0", "request_interval": "50ms"}),
            (now - timedelta(hours=8)).isoformat() + "Z"
        ),
        (
            "SQL Injection Probe",
            "High",
            74,
            "198.51.100.44",
            "/api/threats/search?q=",
            "Pattern detected in query parameter matching SQL union subselect signature: ' UNION SELECT 1, @@version --.",
            "Block request at application gateway WAF filter, sanitize parameters, and flag IP address reputation.",
            "Blocked",
            1,
            json.dumps({"injected_token": "' UNION SELECT 1, @@version --", "parameter": "q"}),
            (now - timedelta(hours=14)).isoformat() + "Z"
        )
    ]

    cursor.executemany("""
    INSERT INTO threat_events (
        type, severity, threat_score, source_ip, target_endpoint,
        detection_reason, recommended_action, status, is_simulated, details, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, initial_threats)

    # Initial Security Logs
    initial_logs = [
        ("Firewall Rule Enforced", "High", "185.220.101.5", "Edge firewall dropped 28 invalid SYN packets following brute force threshold breach.", (now - timedelta(minutes=10)).isoformat() + "Z"),
        ("Volumetric Attack Filter Active", "Critical", "45.142.195.88", "DDoS mitigation proxy absorbed 1.4 Gbps synthetic UDP/HTTP flood.", (now - timedelta(minutes=22)).isoformat() + "Z"),
        ("IDS Signature Match", "Critical", "91.240.118.172", "Known malicious binary signature flagged in temporary cache directory.", (now - timedelta(hours=3, minutes=40)).isoformat() + "Z"),
        ("DNS Sinkhole Triggered", "High", "103.145.13.204", "Domain 'login-cybershield-auth.net' redirected to 127.0.0.1 null sinkhole.", (now - timedelta(hours=2)).isoformat() + "Z"),
        ("Authentication Denied", "Medium", "103.251.167.20", "Admin account session rejected due to geo-velocity impossibility.", (now - timedelta(hours=4, minutes=58)).isoformat() + "Z"),
        ("Heuristic Rule Activated", "Low", "178.62.204.14", "Automated client scraper identified by repetitive TLS fingerprint.", (now - timedelta(hours=7, minutes=50)).isoformat() + "Z"),
        ("WAF Pattern Block", "High", "198.51.100.44", "Web Application Firewall intercepted SQL injection pattern on public search API.", (now - timedelta(hours=13, minutes=55)).isoformat() + "Z"),
        ("SSL/TLS Handshake Audit", "Low", "192.168.1.105", "TLS 1.3 negotiated with internal client; cipher suite AES-256-GCM-SHA384.", (now - timedelta(hours=18)).isoformat() + "Z"),
        ("System Health Check", "Low", "127.0.0.1", "Periodic defensive engine health check completed: all 6 detection modules operational.", (now - timedelta(hours=22)).isoformat() + "Z")
    ]

    cursor.executemany("""
    INSERT INTO security_logs (event_type, severity, source_ip, message, timestamp)
    VALUES (?, ?, ?, ?, ?)
    """, initial_logs)

    # Initial Monitored IPs
    initial_ips = [
        ("185.220.101.5", 92, "Malicious", "Germany", "Tor Exit Relay Network", 350, "Blocked", (now - timedelta(minutes=12)).isoformat() + "Z"),
        ("45.142.195.88", 95, "Malicious", "Russia", "Hosting Solutions Ltd", 2840, "Blocked", (now - timedelta(minutes=24)).isoformat() + "Z"),
        ("91.240.118.172", 98, "Malicious", "Ukraine", "ColoCrossing Hosting ASN", 412, "Blocked", (now - timedelta(hours=3, minutes=45)).isoformat() + "Z"),
        ("103.145.13.204", 75, "Suspicious", "Indonesia", "PT Telekomunikasi Broadband", 84, "Monitoring", (now - timedelta(hours=2, minutes=5)).isoformat() + "Z"),
        ("194.26.29.112", 70, "Suspicious", "Netherlands", "LeaseWeb Data Center B.V.", 120, "Monitoring", (now - timedelta(hours=1, minutes=10)).isoformat() + "Z"),
        ("103.251.167.20", 45, "Suspicious", "Singapore", "Singtel Global Network", 18, "Monitoring", (now - timedelta(hours=5)).isoformat() + "Z"),
        ("178.62.204.14", 40, "Neutral", "United Kingdom", "DigitalOcean Cloud VPS", 145, "Monitoring", (now - timedelta(hours=8)).isoformat() + "Z"),
        ("8.8.8.8", 5, "Trusted", "United States", "Google Public DNS Anycast", 12, "Whitelisted", (now - timedelta(minutes=1)).isoformat() + "Z")
    ]

    cursor.executemany("""
    INSERT INTO monitored_ips (ip_address, risk_score, reputation, country, asn_org, requests_per_min, status, last_seen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, initial_ips)

    # Initial Settings
    initial_settings = [
        ("auto_block_critical", "true"),
        ("threat_score_threshold", "75"),
        ("rate_limit_rpm", "300"),
        ("email_alerts_enabled", "true"),
        ("realtime_polling_interval", "5"),
        ("defense_mode", "Active Defense (Rule-based)"),
        ("simulation_notice_acknowledged", "true")
    ]

    cursor.executemany("""
    INSERT INTO system_settings (key, value) VALUES (?, ?)
    """, initial_settings)
