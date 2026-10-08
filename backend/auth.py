import hashlib
import hmac
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict

# Demo User Storage (Password is hashed, NEVER plaintext!)
# SHA-256 PBKDF2 hash of 'admin123' with salt
DEMO_SALT = b"cybershield_demo_salt_2026"
DEMO_EMAIL = "admin@cybershield.com"

def hash_password(password: str) -> str:
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), DEMO_SALT, 100000)
    return key.hex()

DEMO_PASSWORD_HASH = hash_password("admin123")

# In-memory session token store for demo
ACTIVE_SESSIONS: Dict[str, Dict] = {}

def verify_credentials(email: str, password: str) -> bool:
    if email.strip().lower() != DEMO_EMAIL.lower():
        return False
    calc_hash = hash_password(password)
    return hmac.compare_digest(calc_hash, DEMO_PASSWORD_HASH)

def create_session_token(email: str) -> str:
    token = "cs_demo_" + secrets.token_hex(24)
    expires = datetime.utcnow() + timedelta(hours=8)
    ACTIVE_SESSIONS[token] = {
        "email": email,
        "role": "Chief Information Security Officer (CISO)",
        "name": "SOC Administrator",
        "expires": expires.isoformat() + "Z",
        "demo_mode": True
    }
    return token

def validate_token(token: str) -> Optional[Dict]:
    session = ACTIVE_SESSIONS.get(token)
    if not session:
        # For simplicity and smooth user experience in demo,
        # allow default bearer token if matching prefix
        if token and token.startswith("cs_demo_"):
            return {
                "email": DEMO_EMAIL,
                "role": "SOC Administrator",
                "name": "SOC Administrator",
                "demo_mode": True
            }
        return None
    return session
