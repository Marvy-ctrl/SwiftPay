from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from .service import LuckyDrawService
from src.db.models import User
from src.auth.dependencies import get_current_user, get_session

draw_router = APIRouter()
lucky_draw_service = LuckyDrawService()


@draw_router.post("/")
async def lucky_draw_route(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    result = await lucky_draw_service.create_lucky_draw(user, session)
    return result


@draw_router.post("/play")
async def play_draw(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):

    result = await lucky_draw_service.daily_lucky_draw(user, session)
    return result
