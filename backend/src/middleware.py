from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi import FastAPI
from src.config import Config


def register_middleware(app: FastAPI):

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            Config.FRONTEND_URL,
            "https://swiftpay-frontend-jet.vercel.app",
            "http://192.168.0.23:3001",
        ],
        # allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            "swiftpay-fow9.onrender.com",
            "localhost",
            "127.0.0.1",
            "backend-tau-vert.vercel.app",
        ],
    )
