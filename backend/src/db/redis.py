import redis.asyncio as redis
from src.config import Config


token_blocklist = redis.from_url(Config.REDIS_URL)


async def add_jti_to_blacklist(jti: str, expiry: int) -> None:
    await token_blocklist.set(name=jti, value="", ex=expiry)


async def token_in_blocklist(jti: str) -> bool:
    jti = await token_blocklist.get(jti)
    return jti is not None
