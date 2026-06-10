"""Punto de entrada de la aplicación FastAPI."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.controllers import health_router
from app.core.logging import get_logger, setup_logging
from app.middleware.error_handler import register_exception_handlers

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    setup_logging()
    logger.info("Iniciando %s v%s [%s]", settings.app_name, settings.app_version, settings.app_env)
    yield
    logger.info("Deteniendo %s", settings.app_name)


def create_app() -> FastAPI:
    """Factory de la aplicación — facilita testing y configuración."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Sistema Web de Gestión Empresarial y Contable con IA",
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(health_router, prefix=settings.api_v1_prefix)

    @app.get("/", tags=["Root"])
    def root() -> dict:
        return {
            "app": settings.app_name,
            "version": settings.app_version,
            "docs": "/docs",
            "health": f"{settings.api_v1_prefix}/health",
        }

    return app


app = create_app()
