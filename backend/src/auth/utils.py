from passlib.context import CryptContext
import jwt
from itsdangerous import URLSafeTimedSerializer
import uuid
import logging
from src.config import Config
from datetime import datetime, timedelta, date, timezone
from random import randint


passwd_context = CryptContext(schemes=["bcrypt"])

ACCESS_TOKEN_EXPIRY = 3600


def generate_password_hash(password: str) -> str:
    hashed = passwd_context.hash(password)
    return hashed


def verify_password(password: str, hashed: str) -> bool:
    return passwd_context.verify(password, hashed)


def generate_pin_hash(transaction_pin: str) -> str:
    hashed = passwd_context.hash(transaction_pin)
    return hashed


def verify_pin_hash(transaction_pin: str, hashed: str) -> bool:
    return passwd_context.verify(transaction_pin, hashed)


def create_access_token(
    user_data: dict, expiry: timedelta = None, refresh: bool = False
):
    payload = {}
    payload["user"] = user_data
    payload["exp"] = datetime.now(timezone.utc) + (
        expiry if expiry is not None else timedelta(seconds=ACCESS_TOKEN_EXPIRY)
    )
    payload["jti"] = str(uuid.uuid4())
    payload["refresh"] = refresh
    secret = Config.JWT_SECRET

    token = jwt.encode(
        payload=payload,
        key=secret,
        algorithm=Config.JWT_ALGORITHM,
    )

    return token


def decode_token(token: str) -> dict:
    try:
        secret = str(Config.JWT_SECRET)
        token_data = jwt.decode(
            jwt=token, key=secret, algorithms=[Config.JWT_ALGORITHM]
        )

        return token_data
    except jwt.PyJWTError as e:
        logging.exception(e)

        return None


serializer = URLSafeTimedSerializer(secret_key=Config.JWT_SECRET)


def create_safe_token(data: dict):
    return serializer.dumps(data, salt="email-confirmation")


def decode_url_safe_token(token: str):
    try:
        return serializer.loads(token, salt="email-confirmation", max_age=3600)
    except Exception as e:
        print("Token decoding failed:", repr(e))
        return None


def generate_account_number():
    account_number = "5" + "".join(str(randint(0, 9)) for _ in range(9))
    return account_number
