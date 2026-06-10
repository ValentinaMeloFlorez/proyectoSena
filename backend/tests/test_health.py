"""Pruebas del endpoint de health check."""

from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient) -> None:
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "CONTAIA PRO"
    assert "health" in data


def test_health_endpoint_structure(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    body = response.json()
    assert body["success"] is True
    assert "data" in body

    health = body["data"]
    assert health["app_name"] == "CONTAIA PRO"
    assert health["status"] in ("healthy", "degraded")
    assert health["database"] in ("connected", "disconnected")
    assert "version" in health
    assert "timestamp" in health
