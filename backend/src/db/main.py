from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker

from src.config import Config

# Create engine
async_engine: AsyncEngine = create_async_engine(
    Config.DATABASE_URL,
    connect_args={"ssl": True},
    echo=True,
)

# Create sessionmaker globally
async_session_maker = async_sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)


# Dependency for FastAPI routes
async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session


# DB initialization
async def init_db() -> None:
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
