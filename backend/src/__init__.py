from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.main import init_db
from src.db.models import User, Transaction, LuckyDraw
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from src.auth.routes import auth_router
from src.users.routes import user_router
from src.transactions.routes import transactions_router
from src.lucky_draw.routes import draw_router
from src.middleware import register_middleware


@asynccontextmanager
async def life_span(app: FastAPI):
    print("Server is starting")
    await init_db()
    yield
    print("Server has stopped")


version = "v1"

app = FastAPI(
    title="SwiftPay",
    description="A swift digital banking system",
    version=version,
    lifespan=life_span,
)
templates = Jinja2Templates(directory="src/templates")

register_middleware(app)


app.include_router(auth_router, prefix=f"/api/{version}/auth", tags=["auth"])
app.include_router(user_router, prefix=f"/api/{version}/users", tags=["users"])
app.include_router(
    transactions_router, prefix=f"/api/{version}/transactions", tags=["transactions"]
)
app.include_router(draw_router, prefix=f"/api/{version}/luckydraw", tags=["luckydraw"])
