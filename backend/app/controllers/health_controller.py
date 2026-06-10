"""Controlador HTTP para health check."""

from fastapi import APIRouter, Depends

from app.schemas.common import APIResponse, HealthResponse
from app.services.health_service import HealthService

router = APIRouter(prefix="/health", tags=["Health"])


def get_health_service() -> HealthService:
    return HealthService()


@router.get("", response_model=APIResponse[HealthResponse])
def health_check(
    service: HealthService = Depends(get_health_service),
) -> APIResponse[HealthResponse]:
    """Verifica el estado operativo del sistema y la base de datos."""
    health = service.get_health_status()
    return APIResponse(
        message="Sistema operativo",
        data=health,
    )
