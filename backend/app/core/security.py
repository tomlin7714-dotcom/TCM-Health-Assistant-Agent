from datetime import datetime, timezone, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.core.config import settings
import hashlib

ALGORITHM = "HS256"


def _hash_bcrypt(password: str) -> str:
    """Hash password with bcrypt directly, avoiding passlib compatibility issues."""
    import bcrypt
    # bcrypt has a 72-byte limit; pre-hash with SHA-256 to handle longer passwords
    if len(password.encode()) > 72:
        password = hashlib.sha256(password.encode()).hexdigest()
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify_bcrypt(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash."""
    import bcrypt
    if len(password.encode()) > 72:
        password = hashlib.sha256(password.encode()).hexdigest()
    return bcrypt.checkpw(password.encode(), hashed.encode())


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if hashed_password.startswith("$2"):
        return _verify_bcrypt(plain_password, hashed_password)
    return False


def get_password_hash(password: str) -> str:
    return _hash_bcrypt(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
