from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import FavoriteToggle, FavoritesOut
from app.services.user_service import get_favorites, toggle_favorite
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=FavoritesOut)
async def list_favorites(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_favorites(db, current_user.id)


@router.post("/toggle", response_model=FavoritesOut)
async def toggle(
    data: FavoriteToggle,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await toggle_favorite(db, current_user.id, data.item_type, data.item_id)
