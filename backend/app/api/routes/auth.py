from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import LoginRequest, TokenResponse, UserOut, UserUpdate
from app.services.user_service import (
    create_guest_user, login_or_create_user, get_user_by_id, update_user
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


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    if data.guest:
        user = await create_guest_user(db)
    elif data.phone:
        user = await login_or_create_user(db, data.phone)
    else:
        raise HTTPException(status_code=400, detail="请提供手机号或选择游客登录")

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
