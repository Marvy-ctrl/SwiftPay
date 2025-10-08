from fastapi import APIRouter, Depends, status
from .schemas import (
    ConfirmTransferModel,
    InitiateTransferModel,
    TransactionPublic,
)
from sqlmodel.ext.asyncio.session import AsyncSession
from src.auth.dependencies import get_current_user, get_session
from fastapi.exceptions import HTTPException
from .service import TransactionsService
from .utils import mask_account
from src.db.models import User, Transaction, TransactionStatus, TransactionType
from sqlmodel import select
from src.auth.utils import verify_pin_hash
from src.templates.credit import credit_alert
from src.templates.debit import debit_alert
from src.mail import mail, create_message
from src.auth.routes import user_service
from datetime import datetime, date
from sqlalchemy import or_
from .utils import get_account_number


transaction_service = TransactionsService()

transactions_router = APIRouter()


@transactions_router.post("/transfer")
async def transfer_money(
    tx_data: InitiateTransferModel,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    receiver = await session.scalar(
        select(User).where(User.account_number == tx_data.receiver_acc_number)
    )

    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Reciever not found"
        )

    transaction = Transaction(
        sender_uid=user.uid,
        receiver_uid=receiver.uid,
        amount=tx_data.amount,
        description=tx_data.description,
        status=TransactionStatus.pending,
        transfer_type=TransactionType.transfer,
    )
    session.add(transaction)
    await session.commit()
    await session.refresh(transaction)

    return {"transaction_id": transaction.uid, "status": "pending"}


@transactions_router.post("/transfer/confirm")
async def confirm_transfer(
    tx_data: ConfirmTransferModel,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    transaction = await session.get(Transaction, tx_data.transaction_uid)
    if not transaction or transaction.sender_uid != user.uid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )
    if transaction.status != TransactionStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_102_PROCESSING,
            detail="Transaction has been processed",
        )
    if user.balance < transaction.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient balance"
        )
    if not verify_pin_hash(tx_data.pin, user.pin_hash):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid pin")
    user.balance -= transaction.amount
    receiver = await session.get(User, transaction.receiver_uid)
    receiver.balance += transaction.amount

    transaction.status = TransactionStatus.success
    sender_user = await user_service.get_user_by_account_number(
        user.account_number, session
    )

    sender_acc_number = sender_user.account_number
    sender_name = f"{sender_user.first_name} {sender_user.last_name}"
    first_name = receiver.first_name
    amount = str(transaction.amount)
    description = transaction.description or "No description"
    new_balance = str(receiver.balance)
    date = datetime.now().strftime("%d-%b-%Y %I:%M %p")
    account_number = receiver.account_number

    subject = "SwiftPay Transaction"
    credit_html_message = credit_alert(
        first_name=first_name,
        amount=amount,
        sender_acc=mask_account(sender_acc_number),
        sender_name=sender_name,
        description=description,
        new_balance=new_balance,
        date=date,
        account_number=account_number,
    )
    sender_balance = str(user.balance)
    debit_html_message = debit_alert(
        first_name=user.first_name,
        amount=amount,
        receiver_acc=(receiver.account_number),
        receiver_name=f"{receiver.first_name} {receiver.last_name}",
        description=description,
        new_balance=sender_balance,
        date=date,
        account_number=user.account_number,
    )
    credit_message = create_message([receiver.email], subject, credit_html_message)
    debit_message = create_message([user.email], subject, debit_html_message)

    await session.commit()
    await session.refresh(transaction)
    await mail.send_message(credit_message)
    await mail.send_message(debit_message)

    return {"status": "success", "transaction_uid": transaction.uid}


@transactions_router.get("/me", response_model=list[TransactionPublic])
async def fetch_all_transactions(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):

    transactions = select(Transaction).where(
        or_(Transaction.sender_uid == user.uid, Transaction.receiver_uid == user.uid)
    )
    result = await session.exec(transactions)
    transacts = result.all()
    response = []
    for tx in transacts:
        if tx.sender_uid == user.uid:
            role = "sent"

            if tx.receiver_uid:
                receiver_info = await get_account_number(tx.receiver_uid, session)

                counterparty = f"Transfer to {receiver_info['first_name']} {receiver_info['last_name']}"

            else:
                counterparty = "LuckyDraw"

        else:
            role = "received"

            if tx.sender_uid:
                sender_info = await get_account_number(tx.sender_uid, session)
                counterparty = f"Received from {sender_info['first_name']} {sender_info['last_name']} "

            else:
                counterparty = "LuckyDraw"

        response.append(
            TransactionPublic(
                uid=tx.uid,
                role=role,
                counterparty=counterparty,
                amount=tx.amount,
                transfer_type=tx.transfer_type.value,
                status=tx.status.value,
                description=tx.description,
                created_at=tx.created_at,
            )
        )

    return response


@transactions_router.get("/{uid}", response_model=TransactionPublic)
async def fetch_single_transaction(
    uid: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    transaction_check = select(Transaction).where(Transaction.uid == uid)
    result = await session.exec(transaction_check)
    transaction = result.one_or_none()
    if not transaction:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )
    if transaction.sender_uid == user.uid:
        role = "sent"

        if transaction.receiver_uid:

            receiver_info = await get_account_number(transaction.receiver_uid, session)
            detail = f"Transfer to {receiver_info['first_name']} {receiver_info['last_name']}"

            counterparty = f" {receiver_info['first_name']} {receiver_info['last_name']} {' '}({mask_account(receiver_info['account_number'])}) "

        else:
            counterparty = "LuckyDraw"
            detail = "LuckyDraw"

    else:
        role = "received"
        if transaction.sender_uid:

            sender_info = await get_account_number(transaction.sender_uid, session)
            detail = (
                f"Received from {sender_info['first_name']} {sender_info['last_name']}"
            )
            counterparty = f" {sender_info['first_name']} {sender_info['last_name']} {" "}({mask_account(sender_info['account_number'])}) "

        else:
            counterparty = "LuckyDraw"
            detail = "LuckyDraw"

    return TransactionPublic(
        uid=transaction.uid,
        role=role,
        detail=detail,
        counterparty=counterparty,
        amount=transaction.amount,
        transfer_type=transaction.transfer_type.value,
        status=transaction.status.value,
        description=transaction.description,
        created_at=transaction.created_at,
    )
