from fastapi import APIRouter, Depends, status, Response
from fastapi.responses import HTMLResponse, JSONResponse
from datetime import timedelta, datetime, timezone
from .schemas import (
    UserCreateModel,
    UserLoginModel,
    UserModel,
    UserUpdateModel,
    PasswordResetRequestModel,
    PasswordResetConfirmModel,
)
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from .service import UserService
from fastapi.exceptions import HTTPException
from .utils import (
    create_safe_token,
    verify_password,
    create_access_token,
    decode_url_safe_token,
    generate_password_hash,
    decode_token,
)
from src.db.redis import add_jti_to_blacklist, token_in_blocklist
from src.mail import mail, create_message
from src.auth.dependencies import (
    AccessTokenBearer,
    RefreshTokenBearer,
    get_current_user,
)

from src.templates.welcome import welcome_email
from src.templates.verify_email import verify_email
from src.lucky_draw.service import LuckyDrawService
from src.config import Config

version = "v1"
auth_router = APIRouter()
user_service = UserService()
luckydraw_service = LuckyDrawService()
ACCESS_TOKEN_EXPIRY = 3600
REFRESH_TOKEN_EXPIRY = 3
ENV = Config.ENV
IS_PROD = ENV == "production"


@auth_router.post("/register")
async def create_account(
    user_data: UserCreateModel,
    session: AsyncSession = Depends(get_session),
):
    email = user_data.email
    user_exists = await user_service.user_exists(email, session)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User with this email already exists",
        )
    new_user = await user_service.create_user(user_data, session)
    token = create_safe_token({"email": user_data.email})

    verification_url = f"{Config.FRONTEND_URL}/verify-email?token={token}"

    html_message = verify_email(user_data.first_name, verification_url)

    subject = "Verify your Email"
    message = create_message([email], subject, html_message)
    try:
        await mail.send_message(message)
    except Exception as e:
        print(" Email sending failed:", e)
    await mail.send_message(message)

    return {
        "message": "Account Created! Check email to verify your account",
        "user": new_user,
    }


@auth_router.get("/verify_account")
async def verify_account(token: str, session: AsyncSession = Depends(get_session)):
    try:
        token_data = decode_url_safe_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )

    user_email = token_data.get("email")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload",
        )

    user = await user_service.get_user_by_email(user_email, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not found",
        )

    if user.is_verified:
        return {"message": "Account already verified"}

    subject = "Welcome to SwiftPay"
    html_message = welcome_email(user.first_name, user.account_number)
    message = create_message([user_email], subject, html_message)

    await user_service.update_user(user_email, {"is_verified": True}, session)
    await luckydraw_service.create_initial_draw_stat(user, session)
    await mail.send_message(message)

    return {
        "message": "Account verified successfully",
        "Account_num": user.account_number,
    }


@auth_router.post("/login")
async def user_login(
    login_data: UserLoginModel, session: AsyncSession = Depends(get_session)
):
    account_number = login_data.account_number
    password = login_data.password
    user = await user_service.get_user_by_account_number(account_number, session)

    if len(account_number) != 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Account number must be 10 digits",
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="You need to verify your account",
        )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    valid_password = verify_password(password, user.password_hash)

    if valid_password:
        access_token = create_access_token(
            user_data={
                "account_number": user.account_number,
                "user_uid": str(user.uid),
            }
        )
        refresh_token = create_access_token(
            user_data={
                "account_number": user.account_number,
                "user_uid": str(user.uid),
            },
            refresh=True,
            expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
        )
        response = JSONResponse(
            content={
                "message": "Login Successful",
                "user": {
                    "account_number": user.account_number,
                    "uid": str(user.uid),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "balance": float(user.balance),
                    "email": user.email,
                },
                "access_token": access_token,
            }
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="None",
            domain=Config.DOMAIN,
        )

        return response
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )


@auth_router.post("/logout")
async def user_logout(
    access_token: dict = Depends(AccessTokenBearer()),
    refresh_token: dict = Depends(RefreshTokenBearer()),
):
    await add_jti_to_blacklist(access_token["jti"], expiry=ACCESS_TOKEN_EXPIRY)
    await add_jti_to_blacklist(refresh_token["jti"], expiry=REFRESH_TOKEN_EXPIRY)

    response = JSONResponse(
        content={"message": "Logged out successfully"},
        status_code=status.HTTP_200_OK,
    )
    response.delete_cookie("refresh_token")

    return response


@auth_router.post("/refresh_token")
async def refresh_token(token_details: dict = Depends(RefreshTokenBearer())):
    if not token_details.get("refresh", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only refresh tokens can be used to generate new access tokens",
        )
    if await token_in_blocklist(token_details["jti"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This refresh token has been revoked",
        )

    expiry_dt = datetime.fromtimestamp(token_details["exp"], tz=timezone.utc)

    if expiry_dt > datetime.now(timezone.utc):
        new_access_token = create_access_token(user_data=token_details["user"])
        return JSONResponse(content={"access token": new_access_token})


@auth_router.post("/request_password_reset")
async def request_password_reset(
    email_data: PasswordResetRequestModel, session: AsyncSession = Depends(get_session)
):
    email = email_data.email
    user = await user_service.get_user_by_email(email, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found"
        )
    token = create_safe_token({"email": email_data.email})
    reset_url = f"{Config.FRONTEND_URL}/reset-confirm?token={token}"

    html_message = f"""


    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
        <h1 style="color: #164E63;">Reset Your Password</h1>
        <p>Hi {user.first_name},</p>
        <p>We received a request to reset your SwiftPay account password. Click the button below to set a new password:</p>
        <a href='{reset_url}' 
        style="display: inline-block; background-color: #164E63; color: white; 
                padding: 12px 25px; border-radius: 5px; text-decoration: none; margin-top: 20px;">
        Reset Password
        </a>
        <p style="margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
        <p style="color: #777777; font-size: 12px; margin-top: 20px;">
        This reset link will expire in 1 hour for security reasons.
        </p>
    </div>
    </div>
    """
    subject = "Reset your password"
    message = create_message([email], subject, html_message)
    await mail.send_message(message)
    return JSONResponse(
        content={
            "message": "Please check your email for instructions to reset your password"
        },
        status_code=status.HTTP_200_OK,
    )


@auth_router.post("/password_reset_confirm/{token}")
async def password_reset_confirm(
    token: str,
    password: PasswordResetConfirmModel,
    session: AsyncSession = Depends(get_session),
):
    new_password = password.reset_password
    token_data = decode_url_safe_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token"
        )
    user = await user_service.get_user_by_email(token_data["email"], session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found"
        )
    password_hash = generate_password_hash(new_password)
    await user_service.update_user_password(
        user.email, {"password_hash": password_hash}, session
    )
    return JSONResponse(
        content={"message": "Password has been reset successfully"},
        status_code=status.HTTP_200_OK,
    )
