from .schemas import UserCreateModel, UserVerifyModel, UserPasswordUpdateModel
from sqlmodel.ext.asyncio.session import AsyncSession
from .utils import generate_password_hash, generate_pin_hash, generate_account_number
from src.db.models import User
from sqlmodel import select


class UserService:
    async def create_user(self, user_data: UserCreateModel, session: AsyncSession):
        user_data_dict = user_data.model_dump()
        acc_num = generate_account_number()
        new_user = User(**user_data_dict)
        new_user.password_hash = generate_password_hash(user_data_dict["password"])
        new_user.pin_hash = generate_pin_hash(user_data_dict["transaction_pin"])
        new_user.account_number = acc_num

        session.add(new_user)

        await session.commit()

        return new_user

    async def update_user(
        self, email: str, update_data: UserVerifyModel, session: AsyncSession
    ):
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        user = result.first()

        if not user:
            return None

        for key, value in update_data.items():
            setattr(user, key, value)

        session.add(user)
        await session.commit()

        return user

    async def update_user_password(
        self, email: str, update_data: UserPasswordUpdateModel, session: AsyncSession
    ):
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        user = result.first()
        if not user:
            raise None
        for key, value in update_data.items():
            setattr(user, key, value)
        session.add(user)
        await session.commit()
        return user

    async def get_user_by_account_number(
        self, account_number: str, session: AsyncSession
    ):
        statement = select(User).where(User.account_number == account_number)
        result = await session.exec(statement)
        user = result.first()
        return user

    async def get_user_by_email(self, email: str, session: AsyncSession):
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        return result.first()

    async def user_exists(self, email: str, session: AsyncSession):
        user = await self.get_user_by_email(email, session)

        return True if user is not None else False
