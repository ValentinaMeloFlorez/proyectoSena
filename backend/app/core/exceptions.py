"""Excepciones de dominio y códigos de error estandarizados."""

from typing import Any


class ContaiaException(Exception):
    """Excepción base del sistema."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = 500,
        details: Any = None,
    ) -> None:
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundException(ContaiaException):
    """Recurso no encontrado."""

    def __init__(self, message: str = "Recurso no encontrado", details: Any = None) -> None:
        super().__init__(message=message, code="NOT_FOUND", status_code=404, details=details)


class ValidationException(ContaiaException):
    """Error de validación de negocio."""

    def __init__(self, message: str = "Datos inválidos", details: Any = None) -> None:
        super().__init__(message=message, code="VALIDATION_ERROR", status_code=422, details=details)


class UnauthorizedException(ContaiaException):
    """Acceso no autorizado (preparado para Módulo 2)."""

    def __init__(self, message: str = "No autorizado", details: Any = None) -> None:
        super().__init__(message=message, code="UNAUTHORIZED", status_code=401, details=details)


class ForbiddenException(ContaiaException):
    """Acceso prohibido (preparado para Módulo 2)."""

    def __init__(self, message: str = "Acceso denegado", details: Any = None) -> None:
        super().__init__(message=message, code="FORBIDDEN", status_code=403, details=details)
