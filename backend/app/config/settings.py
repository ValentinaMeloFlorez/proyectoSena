"""Configuración centralizada de la aplicación."""

from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Variables de entorno tipadas con validación Pydantic."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "CONTAIA PRO"
    app_version: str = "1.0.0"
    app_env: str = "development"
    debug: bool = False

    database_url: str = "mysql+pymysql://contaia:contaia_secret@localhost:3306/contaia_db"

    api_v1_prefix: str = "/api/v1"
    cors_origins: List[str] = ["http://localhost:5173"]

    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 30

    log_level: str = "INFO"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    """Singleton de configuración (cacheado)."""
    return Settings()


settings = get_settings()
