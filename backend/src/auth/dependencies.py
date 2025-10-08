from src.auth.service import UserService
from fastapi.security import HTTPBearer
from fastapi import Request, status, Depends
from fastapi.security.http import HTTPAuthorizationCredentials
from src.auth.utils import decode_token
from fastapi.exceptions import HTTPException
from fastapi import status
from src.db.redis import token_in_blocklist
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session


user_service = UserService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> dict:
        # First, try reading from the Authorization header
        auth = request.headers.get("Authorization")
        token = None
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]
        else:
            # If not found, try getting from cookies
            token = request.cookies.get("refresh_token")

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )

        token_data = decode_token(token)
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        if "jti" not in token_data or "user" not in token_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Malformed token"
            )

        if await token_in_blocklist(token_data["jti"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your token has been revoked",
            )

        return token_data


class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access token required"
            )


class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Refresh token required"
            )


async def get_current_user(
    token_details: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    account_number = token_details["user"]["account_number"]
    user = await user_service.get_user_by_account_number(account_number, session)
    return user
