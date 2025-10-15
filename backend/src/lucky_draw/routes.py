from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from .service import LuckyDrawService
from src.db.models import User
from src.auth.dependencies import get_current_user, get_session

draw_router = APIRouter()
lucky_draw_service = LuckyDrawService()


@draw_router.get("/stats")
async def get_draw_stats(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):

    stats = await lucky_draw_service.get_draws_stats(user, session)
    if not stats:
        return {"draws_left": 0, "message": "No lucky draw stats found"}

    return {
        "draws_left": stats.draws_left,
        "last_draw_date": stats.last_draw_date,
    }


@draw_router.post("/play")
async def play_draw(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):

    result = await lucky_draw_service.daily_lucky_draw(user, session)
    return result
