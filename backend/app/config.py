import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "Scalable REST API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "A Scalable REST API with Authentication & Role-Based Access Control"
    DEBUG: bool = True

    DATABASE_URL: str = "sqlite:///./app.db"

    SECRET_KEY: str = "your-super-secret-key-change-in-production-09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
