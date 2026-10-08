"""
CyberShield Defensive Threat Detection Rules Engine
===================================================
Rule-based heuristic security analysis for defensive threat detection and simulation.
Note: All scenarios and detections are DEMO SIMULATIONS executing defensive heuristics.
"DEMO SIMULATION — No real attack is performed."
"""

import random
from datetime import datetime
from typing import Dict, Any, List

def calculate_severity(score: int) -> str:
    if score >= 75:
        return "Critical"
    elif score >= 50:
        return "High"
    elif score >= 25:
        return "Medium"
    else:
        return "Low"

class DefensiveRulesEngine:
    @staticmethod
    def evaluate_scenario(scenario_type: str, custom_params: Dict[str, Any] = None) -> Dict[str, Any]:
        params = custom_params or {}
        now_iso = datetime.utcnow().isoformat() + "Z"

        if scenario_type == "brute_force":
            failed_count = params.get("failed_attempts", random.randint(15, 35))
            target_account = params.get("target_user", "admin@cybershield.com")
            source_ip = params.get("source_ip", f"185.220.{random.randint(10,250)}.{random.randint(1,250)}")
            
            # Rule: >10 failed attempts within 60s is high/critical
            base_score = min(98, 60 + int(failed_count * 1.2))
            severity = calculate_severity(base_score)

            return {
                "type": "Brute-force Detection",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": source_ip,
                "target_endpoint": "/api/auth/login",
                "detection_reason": f"Defensive Rule #BF-101 triggered: Detected {failed_count} repeated failed authentication requests within a 30-second window targeting account '{target_account}'. High velocity indicates automated password spraying / dictionary attack.",
                "recommended_action": "Instantly place source IP in edge firewall blocklist (iptables/WAF DROP rule), enforce temporary account lockout with exponential backoff, and require Multi-Factor Authentication (MFA) biometric step-up.",
                "status": "Blocked",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {
                    "failed_attempts": failed_count,
                    "target_account": target_account,
                    "threshold_limit": 5,
                    "time_window_seconds": 30,
                    "protocol": "HTTPS / POST"
                }
            }

        elif scenario_type == "ddos":
            req_rate = params.get("request_rate", random.randint(1800, 4200))
            source_ip = params.get("source_ip", f"45.142.{random.randint(100,240)}.{random.randint(1,250)}")
            target_endpoint = params.get("target_endpoint", "/api/v1/gateway")

            # Rule: >1000 req/min baseline breach
            base_score = min(99, 70 + int(req_rate / 150))
            severity = calculate_severity(base_score)

            return {
                "type": "DDoS Traffic Spike",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": source_ip,
                "target_endpoint": target_endpoint,
                "detection_reason": f"Defensive Rule #DOS-204 triggered: Abnormal request surge reaching {req_rate} requests/sec against endpoint '{target_endpoint}'. Influx rate exceeds 400% of maximum calibrated baseline capacity, indicating coordinated layer-7 volumetric flood.",
                "recommended_action": "Activate edge DDoS scrubbing center (e.g. Cloudflare / AWS Shield), challenge incoming traffic with cryptographic proof-of-work, rate-limit ASN to 50 req/min, and null-route offending ingress streams.",
                "status": "Blocked",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {
                    "request_rate_rps": req_rate,
                    "baseline_limit_rps": 300,
                    "attack_vector": "HTTP Flood (Layer 7)",
                    "bandwidth_estimate": f"{round(req_rate * 0.0006, 2)} Gbps"
                }
            }

        elif scenario_type == "phishing":
            fake_domain = params.get("domain", "secure-login-cybershield-auth.com")
            source_ip = params.get("source_ip", f"103.145.{random.randint(10,250)}.{random.randint(1,250)}")
            
            base_score = random.randint(68, 79)
            severity = calculate_severity(base_score)

            return {
                "type": "Phishing Detection",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": source_ip,
                "target_endpoint": "/auth/sso/federation",
                "detection_reason": f"Defensive Rule #PHISH-302 triggered: Deceptive typosquatted domain '{fake_domain}' discovered imitating organizational SSO gateway. Domain registered under high-risk registrar with self-signed TLS and cloned DOM structure.",
                "recommended_action": "Submit immediate takedown request to registrar abuse contact, push domain into internal DNS RPZ sinkhole, invalidate all active bearer tokens for targeted tenant, and broadcast security awareness alert.",
                "status": "Investigating",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {
                    "impersonated_domain": fake_domain,
                    "entropy_score": 0.84,
                    "sslyze_analysis": "Untrusted Cert / Domain Cloned",
                    "takedown_ticket": "SEC-TICKET-8821"
                }
            }

        elif scenario_type == "malware":
            signature = params.get("signature", "Trojan.Generic.Downloader.Agent.v2")
            source_ip = params.get("source_ip", f"91.240.{random.randint(100,250)}.{random.randint(1,250)}")
            target_endpoint = params.get("target_endpoint", "/var/spool/uploads/system_patch.pkg")

            base_score = random.randint(92, 98)
            severity = calculate_severity(base_score)

            return {
                "type": "Malware Alert Simulation",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": source_ip,
                "target_endpoint": target_endpoint,
                "detection_reason": f"Defensive Rule #MALW-401 triggered: Binary checksum matched known threat signature '{signature}'. Payload contains shellcode packing techniques, anti-sandbox delays, and unauthorized persistence registry keys.",
                "recommended_action": "Execute immediate endpoint isolation to sandbox quarantine VLAN, terminate process tree via EDR agent, wipe affected directory, and extract memory telemetry for reverse-engineering artifact analysis.",
                "status": "Blocked",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {
                    "matched_signature": signature,
                    "target_file": target_endpoint,
                    "action_taken": "Automated Process Termination",
                    "sandbox_verdict": "Malicious Binary (High Heuristic)"
                }
            }

        elif scenario_type == "suspicious_login":
            source_ip = params.get("source_ip", f"103.251.{random.randint(100,250)}.{random.randint(1,250)}")
            country = params.get("country", random.choice(["Unknown / VPN Exit", "Kazakhstan", "Nigeria", "Russia", "Panama"]))
            user_agent = params.get("user_agent", "HeadlessChrome/124.0.0.0 (Unusual TLS Fingerprint)")

            base_score = random.randint(35, 48)
            severity = calculate_severity(base_score)

            return {
                "type": "Suspicious Login Detection",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": source_ip,
                "target_endpoint": "/api/user/profile",
                "detection_reason": f"Defensive Rule #GEO-503 triggered: Authentication initiated from geolocation '{country}' which deviates from user baseline location profile within impossible travel speed (delta 18 minutes from primary workstation).",
                "recommended_action": "Revoke active session token immediately, prompt user via registered mobile phone for one-time passcode confirmation, and log geolocation coordinates to security audit trail.",
                "status": "Mitigated",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {
                    "detected_location": country,
                    "user_agent": user_agent,
                    "impossible_travel_flag": True,
                    "calculated_speed_mph": 2400
                }
            }

        elif scenario_type == "port_scan":
            source_ip = params.get("source_ip", f"194.26.{random.randint(10,250)}.{random.randint(1,250)}")
            ports_probed = params.get("ports", "21, 22, 23, 80, 443, 3389, 8080, 8443")
            
            base_score = random.randint(58, 72)
            severity = calculate_severity(base_score)

            return {
                "type": "Port-Scan Alert Simulation",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": source_ip,
                "target_endpoint": f"Port Range Probed: {ports_probed}",
                "detection_reason": f"Defensive Rule #SCAN-602 triggered: Fast sequential TCP SYN packets detected across sensitive control ports ({ports_probed}) without completing 3-way handshakes. Fingerprint matches automated vulnerability scanning tooling (e.g. Nmap / Masscan).",
                "recommended_action": "Apply dynamic stateful firewall ban for source subnet, send TCP RST reset on closed ports, silence response banners, and flag IP on perimeter intrusion detection perimeter.",
                "status": "Mitigated",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {
                    "ports_probed": ports_probed,
                    "probe_type": "TCP SYN Half-Open",
                    "packet_count": 84,
                    "scan_window_ms": 320
                }
            }

        else:
            # Fallback generic scenario
            base_score = 45
            severity = calculate_severity(base_score)
            return {
                "type": "Unusual Traffic Pattern",
                "severity": severity,
                "threat_score": base_score,
                "source_ip": params.get("source_ip", "192.168.1.50"),
                "target_endpoint": params.get("target_endpoint", "/api/system/status"),
                "detection_reason": "Defensive Rule #ANOM-700 triggered: Statistical deviation detected in client packet entropy and header frequency.",
                "recommended_action": "Throttle connection and observe client request pattern over the next 15 minutes.",
                "status": "Active",
                "is_simulated": 1,
                "timestamp": now_iso,
                "notice": "DEMO SIMULATION — No real attack is performed.",
                "engine_mode": "Rule-based Defensive Heuristics",
                "details": {}
            }

    @staticmethod
    def analyze_custom_input(payload_text: str, ip_address: str = "127.0.0.1", request_rate: int = 10) -> Dict[str, Any]:
        """
        Deep defensive inspection on custom user-provided text/payloads/headers.
        Applies pattern rules for SQLi, XSS, Path Traversal, Command Injection, and Brute Force.
        """
        now_iso = datetime.utcnow().isoformat() + "Z"
        matched_rules = []
        threat_score = 10

        payload_lower = (payload_text or "").lower()

        # SQL Injection detection rule
        sqli_signatures = ["union select", "' or '1'='1", "admin' --", "drop table", "information_schema", "sleep(", "benchmark("]
        for sig in sqli_signatures:
            if sig in payload_lower:
                matched_rules.append(f"SQL Injection Heuristic (matched '{sig}')")
                threat_score += 45
                break

        # XSS Cross-Site Scripting rule
        xss_signatures = ["<script", "javascript:", "onerror=", "onload=", "<img src=x", "alert(", "document.cookie"]
        for sig in xss_signatures:
            if sig in payload_lower:
                matched_rules.append(f"Cross-Site Scripting (XSS) Heuristic (matched '{sig}')")
                threat_score += 35
                break

        # Path Traversal / LFI rule
        traversal_signatures = ["../", "..\\", "/etc/passwd", "c:\\windows\\system32", "boot.ini", "/proc/self/"]
        for sig in traversal_signatures:
            if sig in payload_lower:
                matched_rules.append(f"Directory Traversal Heuristic (matched '{sig}')")
                threat_score += 40
                break

        # Remote Command Execution (RCE)
        rce_signatures = ["; bash", "| sh", "powershell -enc", "cmd.exe /c", "/bin/sh", "wget http", "curl http", "; cat /etc"]
        for sig in rce_signatures:
            if sig in payload_lower:
                matched_rules.append(f"Remote Command Injection Heuristic (matched '{sig}')")
                threat_score += 55
                break

        # Request Rate check
        if request_rate > 500:
            matched_rules.append(f"High Request Rate Anomaly ({request_rate} req/min)")
            threat_score += 30
        elif request_rate > 150:
            matched_rules.append(f"Moderate Request Spike ({request_rate} req/min)")
            threat_score += 15

        # Cap score at 100
        threat_score = min(100, threat_score)
        severity = calculate_severity(threat_score)

        if not matched_rules:
            detection_reason = "Defensive Inspection Passed: No known malicious payload signatures, injection tokens, or anomalous rate spikes identified. Payload appears benign."
            recommended_action = "Allow traffic passage. Continue passive monitoring and routine TLS inspection."
            event_type = "Benign Payload Inspection"
            status = "Mitigated"
        else:
            detection_reason = f"Defensive Rules Triggered: [{', '.join(matched_rules)}]. Input violates sanitization criteria."
            if severity == "Critical":
                recommended_action = "Immediate action: Block client IP, terminate active session, and trigger high-priority SOC alert with raw packet capture."
                status = "Blocked"
            elif severity == "High":
                recommended_action = "Reject payload with HTTP 400 Bad Request, log forensic signature, and add source IP to temporary scrutiny list."
                status = "Blocked"
            else:
                recommended_action = "Apply WAF sanitization filter and rate-limit client queries."
                status = "Active"
            event_type = "Custom Threat Detection"

        return {
            "type": event_type,
            "severity": severity,
            "threat_score": threat_score,
            "source_ip": ip_address or "192.168.1.1",
            "target_endpoint": "/api/analyze/payload",
            "detection_reason": detection_reason,
            "recommended_action": recommended_action,
            "status": status,
            "is_simulated": 1,
            "timestamp": now_iso,
            "notice": "DEMO SIMULATION — No real attack is performed.",
            "engine_mode": "Rule-based Defensive Heuristics",
            "matched_rules": matched_rules,
            "details": {
                "inspected_length": len(payload_text or ""),
                "rule_hits": len(matched_rules),
                "request_rate": request_rate
            }
        }
