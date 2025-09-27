from sqlmodel import select
from src.db.models import User
from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import UserPasswordUpdateModel
from decimal import Decimal
from fastapi import status
from fastapi.exceptions import HTTPException


class UserService:
    async def get_user_by_uid(self, uid: str, session: AsyncSession):
        statement = select(User).where(User.uid == uid)
        result = await session.exec(statement)
        return result.first()

    async def update_user_password(
        self, email: str, update_data: UserPasswordUpdateModel, session: AsyncSession
    ):
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        user = result.first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        for key, value in update_data.items():
            setattr(user, key, value)
        session.add(user)
        await session.commit()
        return user

    async def update_balance(self, user: User, amount: Decimal, session: AsyncSession):
        user = await self.get_user_by_uid(user.uid, session)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        updated_balance = user.balance + amount
        user.balance = updated_balance

        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
