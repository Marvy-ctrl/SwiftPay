from pydantic import BaseModel
from typing import Optional
import uuid
from decimal import Decimal
from datetime import datetime
from src.db.models import TransactionType, TransactionStatus


class TransferModel(BaseModel):
    pass


class InitiateTransferModel(BaseModel):
    receiver_acc_number: str
    amount: Decimal
    description: Optional[str] = None


class CreateTransactionModel(BaseModel):
    sender_uid: Optional[uuid.UUID] = None
    receiver_uid: Optional[uuid.UUID] = None
    amount: Decimal
    transfer_type: TransactionType
    status: TransactionStatus
    description: Optional[str] = None


class ConfirmTransferModel(BaseModel):
    transaction_uid: uuid.UUID
    pin: str


class TransactionPublic(BaseModel):
    uid: uuid.UUID
    role: str
    counterparty: str
    detail: Optional[str] = None

    amount: Decimal
    transfer_type: str
    status: str
    description: str | None
    created_at: datetime
