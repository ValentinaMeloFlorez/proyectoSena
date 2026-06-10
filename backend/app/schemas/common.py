"""Schemas Pydantic compartidos (capa Vista de datos)."""

from datetime import datetime
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Envelope estándar de respuesta exitosa."""

    success: bool = True
    message: str = "Operación exitosa"
    data: Optional[T] = None


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    """Envelope estándar de respuesta de error."""

    success: bool = False
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseModel):
    """Respuesta del endpoint de health check."""

    status: str
    app_name: str
    version: str
    environment: str
    database: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PaginationParams(BaseModel):
    """Parámetros de paginación reutilizables."""

    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


class PaginationMeta(BaseModel):
    """Metadatos de paginación en respuestas."""

    page: int
    page_size: int
    total_items: int
    total_pages: int
