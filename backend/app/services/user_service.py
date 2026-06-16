from typing import Optional, List
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import User, Consultation, Favorite, Reminder, Feedback
from app.schemas.schemas import (
    ConsultationCreate, ConsultationOut,
    FavoritesOut, ReminderCreate, FeedbackCreate,
    UserUpdate,
)
from app.core.security import get_password_hash, verify_password, create_access_token
import uuid


# ── User ──────────────────────────────────────────────────────────────────────

async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_phone(db: AsyncSession, phone: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.phone == phone))
    return result.scalar_one_or_none()


async def create_guest_user(db: AsyncSession) -> User:
    user = User(
        id=str(uuid.uuid4()),
        name="神农山客(游客)",
        level="体验成员",
        is_guest=True,
        avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def login_or_create_user(db: AsyncSession, phone: str) -> User:
    user = await get_user_by_phone(db, phone)
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            phone=phone,
            name=f"中医会员{phone[-4:]}",
            level="普通会员",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


async def update_user(db: AsyncSession, user: User, data: UserUpdate) -> User:
    if data.name is not None:
        user.name = data.name
    if data.avatar is not None:
        user.avatar = data.avatar
    if data.constitution is not None:
        user.constitution = data.constitution
    await db.commit()
    await db.refresh(user)
    return user


# ── Consultation ──────────────────────────────────────────────────────────────

async def get_consultations(db: AsyncSession, user_id: str) -> List[Consultation]:
    result = await db.execute(
        select(Consultation)
        .where(Consultation.user_id == user_id)
        .order_by(Consultation.created_at.desc())
    )
    return list(result.scalars().all())


async def create_consultation(db: AsyncSession, user_id: str, data: ConsultationCreate) -> Consultation:
    record = Consultation(
        user_id=user_id,
        title=data.title,
        type=data.type,
        symptoms=data.symptoms,
        analysis=data.analysis,
        suggestion=data.suggestion,
        image_url=data.image_url,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


# ── Favorites ─────────────────────────────────────────────────────────────────

async def get_favorites(db: AsyncSession, user_id: str) -> FavoritesOut:
    result = await db.execute(select(Favorite).where(Favorite.user_id == user_id))
    rows = list(result.scalars().all())
    return FavoritesOut(
        herbs=[r.item_id for r in rows if r.item_type == "herbs"],
        recipes=[r.item_id for r in rows if r.item_type == "recipes"],
        workouts=[r.item_id for r in rows if r.item_type == "workouts"],
    )


async def toggle_favorite(db: AsyncSession, user_id: str, item_type: str, item_id: str) -> FavoritesOut:
    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == user_id,
            Favorite.item_type == item_type,
            Favorite.item_id == item_id,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        await db.delete(existing)
    else:
        db.add(Favorite(user_id=user_id, item_type=item_type, item_id=item_id))
    await db.commit()
    return await get_favorites(db, user_id)


# ── Reminders ─────────────────────────────────────────────────────────────────

async def get_reminders(db: AsyncSession, user_id: str) -> List[Reminder]:
    result = await db.execute(select(Reminder).where(Reminder.user_id == user_id))
    return list(result.scalars().all())


async def create_reminder(db: AsyncSession, user_id: str, data: ReminderCreate) -> Reminder:
    reminder = Reminder(user_id=user_id, **data.model_dump())
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder


async def toggle_reminder(db: AsyncSession, user_id: str, reminder_id: str) -> Optional[Reminder]:
    result = await db.execute(
        select(Reminder).where(Reminder.id == reminder_id, Reminder.user_id == user_id)
    )
    reminder = result.scalar_one_or_none()
    if reminder:
        reminder.active = not reminder.active
        await db.commit()
        await db.refresh(reminder)
    return reminder


# ── Feedback ──────────────────────────────────────────────────────────────────

async def create_feedback(db: AsyncSession, user_id: str, data: FeedbackCreate) -> Feedback:
    fb = Feedback(user_id=user_id, **data.model_dump())
    db.add(fb)
    await db.commit()
    await db.refresh(fb)
    return fb
