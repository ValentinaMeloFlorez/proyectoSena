"""Servicio de health check del sistema."""

from app.config import settings
from app.core.database import check_database_connection
from app.schemas.common import HealthResponse


class HealthService:
    """Lógica de negocio para verificación de estado del sistema."""

    def get_health_status(self) -> HealthResponse:
        db_connected = check_database_connection()

        return HealthResponse(
            status="healthy" if db_connected else "degraded",
            app_name=settings.app_name,
            version=settings.app_version,
            environment=settings.app_env,
            database="connected" if db_connected else "disconnected",
        )
