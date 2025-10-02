from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.auth.dependencies import get_current_user
from src.db.models import User, LuckyDrawStats, Transaction
from src.transactions.service import TransactionsService
import random
from datetime import date
from fastapi import status
from fastapi.exceptions import HTTPException
from decimal import Decimal
from src.users.service import UserService


user_service = UserService()
transactions_service = TransactionsService()


class LuckyDrawService:
    async def get_draws_stats(self, user: User, session: AsyncSession):
        statement = select(LuckyDrawStats).where(LuckyDrawStats.user_uid == user.uid)
        result = await session.exec(statement)
        draw_stats = result.first()

        return draw_stats

    async def daily_lucky_draw(self, user: User, session: AsyncSession):
        stats = await self.get_draws_stats(user, session)

        if not stats.last_draw_date or stats.last_draw_date != date.today():
            stats.draws_left = 2
            stats.last_draw_date = date.today()

        if stats.draws_left <= 0:
            return {"message": "No draws left today", "draws_left": stats.draws_left}

        draws = [Decimal("500"), Decimal("300"), Decimal("100"), Decimal("1000")]

        if user.balance > 0:
            negative_balance = -(Decimal("0.4") * user.balance)
            draws.append(negative_balance.quantize(Decimal("0.01")))
        else:
            draws.append(Decimal("0"))

        user_pick = random.choice(draws)

        user.balance += user_pick
        stats.draws_left -= 1

        session.add(user)
        session.add(stats)

        transaction = Transaction(
            receiver_uid=user.uid,
            amount=user_pick,
            transfer_type="lucky_draw",
            status="success",
        )
        session.add(transaction)

        await session.commit()
        await session.refresh(user)
        await session.refresh(stats)

        return {"user": user, "draws_left": stats.draws_left, "won": user_pick}

    async def create_initial_draw_stat(self, user: User, session: AsyncSession):
        stats = await self.get_draws_stats(user, session)

        if not stats:
            new_stats = LuckyDrawStats(user_uid=user.uid, draws_left=2)
            session.add(new_stats)
            await session.commit()
