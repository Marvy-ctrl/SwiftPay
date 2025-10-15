from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import CreateTransactionModel
from src.db.models import Transaction
from src.auth.service import UserService


user_service = UserService()


class TransactionsService:
    async def create_transaction(
        self, tx_data: CreateTransactionModel, session: AsyncSession
    ):
        new_transaction = Transaction(**tx_data)
        session.add(new_transaction)
        await session.commit()

        return new_transaction

    async def confirm_name(self, account_number: str, session: AsyncSession):
        user = await user_service.get_user_by_account_number(account_number, session)

        if not user:
            return None
        return f"{user.first_name} {user.last_name}"
