"""Manejadores globales de excepciones."""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import ContaiaException
from app.schemas.common import ErrorResponse

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    """Registra todos los manejadores de errores en la aplicación."""

    @app.exception_handler(ContaiaException)
    async def contaia_exception_handler(
        request: Request, exc: ContaiaException
    ) -> JSONResponse:
        logger.warning("ContaiaException: %s | path=%s", exc.message, request.url.path)
        error = ErrorResponse(code=exc.code, message=exc.message)
        return JSONResponse(status_code=exc.status_code, content=error.model_dump(mode="json"))

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        error = ErrorResponse(
            code="HTTP_ERROR",
            message=str(exc.detail),
        )
        return JSONResponse(status_code=exc.status_code, content=error.model_dump(mode="json"))

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        details = [
            {"field": ".".join(str(loc) for loc in err["loc"]), "message": err["msg"]}
            for err in exc.errors()
        ]
        error = ErrorResponse(
            code="VALIDATION_ERROR",
            message="Error de validación en la solicitud",
            details=details,
        )
        return JSONResponse(status_code=422, content=error.model_dump(mode="json"))

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        logger.exception("Unhandled exception: %s | path=%s", exc, request.url.path)
        error = ErrorResponse(
            code="INTERNAL_ERROR",
            message="Error interno del servidor",
        )
        return JSONResponse(status_code=500, content=error.model_dump(mode="json"))
