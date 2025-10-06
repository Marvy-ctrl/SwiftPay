from pydantic import BaseModel, EmailStr, Field
import uuid
from datetime import datetime, date
from typing import Optional

# password_regex = (
#     r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$"
# )
# pin_regex = r"^\d{4}$"


class UserCreateModel(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    # mobile_number: str
    # password: str = Field(
    #     ...,
    #     pattern=password_regex,
    #     description="Password must be 8-32 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character",
    # )
    # transaction_pin: str = Field(..., pattern=pin_regex)
    password: str = Field(
        min_length=8,
        max_length=32,
        description="Password must be 8-32 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character",
    )
    transaction_pin: str = Field(min_length=4, max_length=4)


class UserModel(BaseModel):
    uid: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    account_number: str
    is_verified: bool
    password_hash: str = Field(exclude=True)
    created_at: datetime
    update_at: datetime


class UserLoginModel(BaseModel):
    account_number: str
    password: str


class UserUpdateModel(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str
    transaction_pin: str


class UserVerifyModel(BaseModel):
    is_verified: bool


class PasswordResetRequestModel(BaseModel):
    email: EmailStr


class PasswordResetConfirmModel(BaseModel):
    reset_password: str


class UserPasswordUpdateModel(BaseModel):
    password: str
