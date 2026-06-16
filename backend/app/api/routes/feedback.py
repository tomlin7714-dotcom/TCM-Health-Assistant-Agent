from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import FeedbackCreate, FeedbackOut
from app.services.user_service import create_feedback
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("", response_model=FeedbackOut)
async def submit_feedback(
    data: FeedbackCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    fb = await create_feedback(db, current_user.id, data)
    return FeedbackOut(
        id=fb.id,
        type=fb.type,
        content=fb.content,
        email=fb.email,
        date=fb.created_at.strftime("%Y-%m-%d"),
    )
