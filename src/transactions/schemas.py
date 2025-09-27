from pydantic import BaseModel
from typing import Optional
import uuid
from decimal import Decimal
from datetime import datetime
from src.db.models import TransactionType, TransactionStatus


class TransferModel(BaseModel):
    pass


class CreateTransactionModel(BaseModel):
    sender_uid: Optional[uuid.UUID] = None
    receiver_uid: Optional[uuid.UUID] = None
    amount: Decimal
    transfer_type: TransactionType
    status: TransactionStatus
    description: Optional[str] = None


class TransactionPublic(BaseModel):
    uid: uuid.UUID
    role: str  # "sent" or "received"
    counterparty: str
    amount: Decimal
    transfer_type: str
    status: str
    description: str | None
    created_at: datetime
