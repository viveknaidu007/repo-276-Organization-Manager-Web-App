from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
from app.core.config import settings

security = HTTPBearer()

class AuthUser:
    def __init__(self, user_id: str):
        self.id = user_id


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthUser:
    token = credentials.credentials

    # If Supabase JWT secret is configured, validate JWT locally
    if settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"])
            user_id: Optional[str] = payload.get("sub") or payload.get("user_id") or payload.get("uid")
            if user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: no sub")
            return AuthUser(user_id=user_id)
        except JWTError as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e

    # Fallback: accept any non-empty token and treat token itself as user id (for local demo)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return AuthUser(user_id=token)
