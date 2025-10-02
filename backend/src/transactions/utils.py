from sqlalchemy.ext.asyncio.session import AsyncSession
from src.auth.dependencies import get_session
from fastapi import Depends
from sqlmodel import select
from src.db.models import User


def mask_account(account: str) -> str:
    account = str(account)
    return "*" * 6 + account[-4:]


async def get_account_number(
    user_uid: str, session: AsyncSession = Depends(get_session)
):

    statement = select(User).where(User.uid == user_uid)
    result = await session.exec(statement)
    user = result.first()

    return {
        "account_number": user.account_number,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
