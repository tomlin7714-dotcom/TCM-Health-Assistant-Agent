import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Text, Integer, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum


def utcnow():
    return datetime.now(timezone.utc)


class ConstitutionType(str, enum.Enum):
    BALANCED = "平和质"
    YANG_DEFICIENCY = "阳虚质"
    QI_DEFICIENCY = "气虚质"
    YIN_DEFICIENCY = "阴虚质"
    PHLEGM_DAMPNESS = "痰湿质"
    DAMP_HEAT = "湿热质"
    BLOOD_STASIS = "血瘀质"
    QI_STAGNATION = "气郁质"
    SPECIAL = "特禀质"
    UNTESTED = "未测试"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(50), default="新用户")
    avatar: Mapped[str | None] = mapped_column(Text, nullable=True)
    level: Mapped[str] = mapped_column(String(50), default="普通会员")
    constitution: Mapped[str] = mapped_column(String(10), default=ConstitutionType.UNTESTED.value)
    hashed_password: Mapped[str | None] = mapped_column(String(128), nullable=True)
    is_guest: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    consultations: Mapped[list["Consultation"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    favorites: Mapped[list["Favorite"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    reminders: Mapped[list["Reminder"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    feedbacks: Mapped[list["Feedback"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class ConsultationType(str, enum.Enum):
    PULSE = "pulse"
    REVIEW = "review"
    TONGUE = "tongue"
    SEASONAL = "seasonal"


class Consultation(Base):
    __tablename__ = "consultations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200))
    type: Mapped[str] = mapped_column(String(20), default=ConsultationType.TONGUE.value)
    symptoms: Mapped[str] = mapped_column(Text)
    analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggestion: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="consultations")


class FavoriteType(str, enum.Enum):
    HERB = "herbs"
    RECIPE = "recipes"
    WORKOUT = "workouts"


class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    item_type: Mapped[str] = mapped_column(String(20))
    item_id: Mapped[str] = mapped_column(String(36))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="favorites")


class ReminderType(str, enum.Enum):
    QIGONG = "qigong"
    TEA = "tea"
    SLEEP = "sleep"
    ACUPOINT = "acupoint"


class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100))
    time: Mapped[str] = mapped_column(String(10))
    frequency: Mapped[str] = mapped_column(String(50))
    type: Mapped[str] = mapped_column(String(20), default=ReminderType.QIGONG.value)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="reminders")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50))
    content: Mapped[str] = mapped_column(Text)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="feedbacks")
