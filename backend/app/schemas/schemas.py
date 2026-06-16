from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator
import re


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    phone: Optional[str] = None
    password: Optional[str] = None
    guest: bool = False

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(r"^1[3-9]\d{9}$", v):
            raise ValueError("手机号格式不正确")
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# ── User ──────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    name: str
    avatar: Optional[str]
    level: str
    constitution: str
    is_guest: bool

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    constitution: Optional[str] = None


# ── Consultation ──────────────────────────────────────────────────────────────

class ConsultationCreate(BaseModel):
    title: str
    type: str = "tongue"
    symptoms: str
    analysis: Optional[str] = None
    suggestion: str
    image_url: Optional[str] = None


class ConsultationOut(BaseModel):
    id: str
    title: str
    date: str
    type: str
    symptoms: str
    analysis: Optional[str]
    suggestion: str
    image_url: Optional[str]

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_date(cls, obj) -> "ConsultationOut":
        return cls(
            id=obj.id,
            title=obj.title,
            date=obj.created_at.strftime("%Y-%m-%d"),
            type=obj.type,
            symptoms=obj.symptoms,
            analysis=obj.analysis,
            suggestion=obj.suggestion,
            image_url=obj.image_url,
        )


# ── Favorites ─────────────────────────────────────────────────────────────────

class FavoriteToggle(BaseModel):
    item_type: str  # herbs | recipes | workouts
    item_id: str


class FavoritesOut(BaseModel):
    herbs: List[str]
    recipes: List[str]
    workouts: List[str]


# ── Reminder ──────────────────────────────────────────────────────────────────

class ReminderCreate(BaseModel):
    name: str
    time: str
    frequency: str
    type: str


class ReminderOut(BaseModel):
    id: str
    name: str
    time: str
    frequency: str
    type: str
    active: bool

    model_config = {"from_attributes": True}


# ── Feedback ──────────────────────────────────────────────────────────────────

class FeedbackCreate(BaseModel):
    type: str
    content: str
    email: Optional[str] = None


class FeedbackOut(BaseModel):
    id: str
    type: str
    content: str
    email: Optional[str]
    date: str

    model_config = {"from_attributes": True}


# ── Diagnose ──────────────────────────────────────────────────────────────────

class DiagnoseRequest(BaseModel):
    symptoms: str
    image_base64: Optional[str] = None


class DiagnoseResult(BaseModel):
    title: str
    diagnosis: str
    advice: str
    herb_id: Optional[str] = None
    recipe_id: Optional[str] = None
    constitution: Optional[str] = None


# ── Constitution ──────────────────────────────────────────────────────────────

class ConstitutionAnswer(BaseModel):
    question_id: int
    score: int


class ConstitutionEvaluateRequest(BaseModel):
    answers: List[ConstitutionAnswer]


class ConstitutionResult(BaseModel):
    constitution: str
    description: str
    advice: str
