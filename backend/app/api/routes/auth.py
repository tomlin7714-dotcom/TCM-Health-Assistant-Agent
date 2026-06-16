import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import LoginRequest, RegisterRequest, TokenResponse, UserOut, UserUpdate
from app.services.user_service import (
    create_guest_user, login_or_create_user, get_user_by_id, update_user,
    register_user, login_by_credentials,
)
from app.core.security import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="未提供认证令牌")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="令牌无效或已过期")
    user = await get_user_by_id(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在")
    return user


@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    try:
        user = await register_user(db, data.username, data.password)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    if data.guest:
        user = await create_guest_user(db)
    elif data.username and data.password:
        try:
            user = await login_by_credentials(db, data.username, data.password)
        except ValueError as e:
            raise HTTPException(status_code=401, detail=str(e))
    elif data.phone:
        user = await login_or_create_user(db, data.phone)
    else:
        raise HTTPException(status_code=400, detail="请提供用户名密码、手机号或选择游客登录")

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/logout")
async def logout():
    return {"message": "已安全退出登录"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.put("/me", response_model=UserOut)
async def update_me(
    data: UserUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    updated = await update_user(db, current_user, data)
    return UserOut.model_validate(updated)


UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        raise HTTPException(status_code=400, detail="仅支持 JPG / PNG / WebP / GIF 格式")
    content = await file.read()
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="图片大小不能超过 2MB")

    ext = os.path.splitext(file.filename or "avatar.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_DIR / filename
    filepath.write_bytes(content)

    avatar_url = f"/uploads/avatars/{filename}"
    await update_user(db, current_user, UserUpdate(avatar=avatar_url))
    return {"avatar_url": avatar_url}
