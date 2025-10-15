from sqlmodel import SQLModel, Field, Column, ForeignKey, Relationship
import sqlalchemy.dialects.postgresql as pg
from datetime import datetime, date
import uuid
from typing import Optional, List
from decimal import Decimal
from enum import Enum


class User(SQLModel, table=True):
    __tablename__ = "users"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    first_name: str
    last_name: str
    email: str
    username: str
    account_number: str = Field(index=True, unique=True, nullable=False)
    balance: Decimal = Field(
        default=Decimal("0.00"), sa_column=Column(pg.NUMERIC(12, 2), nullable=False)
    )
    password_hash: str = Field(exclude=True)
    pin_hash: str = Field(exclude=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    # def __repr__(self):
    #     return f"<User(username={self.username}, email={self.email})>"


class TransactionType(str, Enum):
    transfer = "transfer"
    lucky_draw = "lucky_draw"
    deposit = "deposit"
    withdrawal = "withdrawal"


class TransactionStatus(str, Enum):
    pending = "pending"
    success = "success"
    failed = "failed"


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    sender_uid: Optional[uuid.UUID] = Field(nullable=True, foreign_key="users.uid")
    receiver_uid: Optional[uuid.UUID] = Field(nullable=True, foreign_key="users.uid")
    amount: Decimal = Field(
        default=Decimal("0.00"), sa_column=Column(pg.NUMERIC(12, 2), nullable=False)
    )
    transfer_type: TransactionType = Field(
        sa_column=Column(
            pg.ENUM(TransactionType, name="transaction_type", nullable=False),
            nullable=False,
        ),
    )
    status: TransactionStatus = Field(
        sa_column=Column(
            pg.ENUM(TransactionStatus, name="transaction_status"),
            nullable=False,
        ),
    )
    description: str = Field(nullable=True)
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))


class LuckyDraw(SQLModel, table=True):
    __tablename__ = "lucky_draw"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    user_uid: Optional[uuid.UUID] = Field(nullable=False, foreign_key="users.uid")
    amount_won: Decimal = Field(
        default=Decimal("0.00"), sa_column=Column(pg.NUMERIC(12, 2), nullable=False)
    )
    last_draw: datetime
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))


class LuckyDrawStats(SQLModel, table=True):
    __tablename__ = "lucky_draw_stats"

    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, primary_key=True, default=uuid.uuid4, nullable=False)
    )
    user_uid: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            ForeignKey("users.uid"),
            unique=True,
            nullable=False,
        )
    )
    draws_left: int = Field(default=2, nullable=False)
    last_draw_date: Optional[date] = None
    updated_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )
