from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from src.auth.dependencies import get_current_user, get_session, AccessTokenBearer
from src.users.schemas import (
    CurrentUserModel,
    UserUpdateProfileModel,
    UserModel,
    PasswordResetModel,
    PinResetModel,
)
from sqlmodel.ext.asyncio.session import AsyncSession
from src.users.service import UserService
from src.auth.utils import (
    generate_password_hash,
    generate_pin_hash,
    verify_password,
    verify_pin_hash,
)


user_service = UserService()
user_router = APIRouter()


@user_router.get("/me", response_model=CurrentUserModel)
async def get_current_user(user=Depends(get_current_user)):
    return user


@user_router.patch("/me", response_model=UserModel)
async def update_profile(
    update_data: UserUpdateProfileModel,
    token_details: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_uid = token_details["user"]["user_uid"]

    user = await user_service.get_user_by_uid(user_uid, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    for key, value in update_data:
        setattr(user, key, value)

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@user_router.patch("/me/change_password")
async def change_password(
    password: PasswordResetModel,
    user=Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not verify_password(password.old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password"
        )

    user.password_hash = generate_password_hash(password.new_password)
    session.add(user)
    await session.commit()

    return JSONResponse(
        content={"message": "Password has been changed successfully"},
        status_code=status.HTTP_200_OK,
    )


@user_router.patch("/me/change_pin")
async def change_pin(
    pin: PinResetModel,
    user=Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not verify_pin_hash(pin.old_pin, user.pin_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password"
        )

    user.pin_hash = generate_pin_hash(pin.new_pin)
    session.add(user)
    await session.commit()

    return JSONResponse(
        content={"message": "Your pin has been changed successfully"},
        status_code=status.HTTP_200_OK,
    )


@user_router.delete("/me")
async def delete_account(
    user=Depends(get_current_user), session: AsyncSession = Depends(get_session)
):
    await session.delete(user)
    await session.commit()
    return {"message": "Your account has been successfully deleted"}
