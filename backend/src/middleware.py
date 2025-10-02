from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi import FastAPI
from src.config import Config


def register_middleware(app: FastAPI):

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[Config.FRONTEND_URL],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            "localhost",
            "127.0.0.1",
            "localhost:3000",
        ],
    )
