from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.schemas.schemas import ConsultationCreate, ConsultationOut
from app.services.user_service import get_consultations, create_consultation
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=List[ConsultationOut])
async def list_history(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    records = await get_consultations(db, current_user.id)
    return [ConsultationOut.from_orm_with_date(r) for r in records]


@router.post("", response_model=ConsultationOut)
async def add_consultation(
    data: ConsultationCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    record = await create_consultation(db, current_user.id, data)
    return ConsultationOut.from_orm_with_date(record)
