from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.schemas.schemas import ReminderCreate, ReminderOut
from app.services.user_service import get_reminders, create_reminder, toggle_reminder
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.get("", response_model=List[ReminderOut])
async def list_reminders(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_reminders(db, current_user.id)


@router.post("", response_model=ReminderOut)
async def add_reminder(
    data: ReminderCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_reminder(db, current_user.id, data)


@router.patch("/{reminder_id}/toggle", response_model=ReminderOut)
async def toggle(
    reminder_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    reminder = await toggle_reminder(db, current_user.id, reminder_id)
    if not reminder:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="提醒不存在")
    return reminder
