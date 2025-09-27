from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import CreateTransactionModel
from src.db.models import Transaction


class TransactionsService:
    async def create_transaction(
        self, tx_data: CreateTransactionModel, session: AsyncSession
    ):
        new_transaction = Transaction(**tx_data)
        session.add(new_transaction)
        await session.commit()

        return new_transaction
