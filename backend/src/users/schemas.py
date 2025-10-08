from pydantic import BaseModel, Field, EmailStr
import uuid


class CurrentUserModel(BaseModel):
    uid: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    account_number: str
    balance: float
    is_verified: bool


class UserModel(BaseModel):
    uid: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    username: str


class UserUpdateProfileModel(BaseModel):
    username: str


class PasswordResetModel(BaseModel):
    old_password: str
    new_password: str


class UserPasswordUpdateModel(BaseModel):
    password: str


class PinResetModel(BaseModel):
    old_pin: str
    new_pin: str


class UserPinUpdateModel(BaseModel):
    pin: str
