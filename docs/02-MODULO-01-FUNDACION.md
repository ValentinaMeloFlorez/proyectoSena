# Módulo 1 — Fundación e Infraestructura

## Objetivo

Establecer la base técnica sobre la que se construirán todos los módulos funcionales de CONTAIA PRO.

## Alcance

### Incluido ✅
- Estructura monorepo profesional
- Backend FastAPI con arquitectura MVC en capas
- Frontend React + TypeScript + Vite + TailwindCSS
- Conexión a MySQL con SQLAlchemy 2.0 (driver: PyMySQL)
- Migraciones con Alembic
- Endpoint de health check
- Manejo centralizado de errores
- Logging estructurado
- Layout base de la aplicación (sidebar, header)
- Docker Compose para desarrollo
- Pruebas básicas del health endpoint
- Documentación técnica

### Excluido (módulos posteriores) ❌
- Autenticación / JWT
- Modelos de negocio (empresas, cuentas, facturas)
- Integración con IA
- Reportes

---

## Dependencias

### Backend — `pip install`

```bash
cd backend
pip install -r requirements.txt
```

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| fastapi | 0.115.6 | Framework web async |
| uvicorn[standard] | 0.34.0 | Servidor ASGI |
| sqlalchemy | 2.0.36 | ORM |
| alembic | 1.14.0 | Migraciones |
| pymysql | 1.0.3 | Driver MySQL (PyMySQL) |
| pydantic-settings | 2.7.0 | Configuración tipada |
| python-dotenv | 1.0.1 | Variables de entorno |
| httpx | 0.28.1 | Cliente HTTP (tests) |
| pytest | 8.3.4 | Framework de pruebas |
| pytest-asyncio | 0.25.0 | Soporte async en tests |

### Frontend — `npm install`

```bash
cd frontend
npm install
```

| Paquete | Propósito |
|---------|-----------|
| react / react-dom | UI library |
| react-router-dom | Enrutamiento SPA |
| axios | Cliente HTTP |
| tailwindcss | Estilos utility-first |
| @tanstack/react-query | Cache y estado servidor |

---

## Comandos de Desarrollo

### Con Docker (recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

### Sin Docker

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

### URLs de desarrollo

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/v1/health |

---

## Archivos del Módulo

### Backend

| Archivo | Ubicación | Responsabilidad |
|---------|-----------|-----------------|
| `main.py` | `backend/app/` | Punto de entrada FastAPI |
| `settings.py` | `backend/app/config/` | Configuración centralizada |
| `database.py` | `backend/app/core/` | Sesión SQLAlchemy |
| `exceptions.py` | `backend/app/core/` | Excepciones de dominio |
| `logging.py` | `backend/app/core/` | Configuración de logs |
| `base.py` | `backend/app/models/` | Modelo base ORM |
| `common.py` | `backend/app/schemas/` | Schemas compartidos |
| `health_controller.py` | `backend/app/controllers/` | Rutas health |
| `health_service.py` | `backend/app/services/` | Lógica health |
| `base_repository.py` | `backend/app/repositories/` | CRUD genérico |
| `error_handler.py` | `backend/app/middleware/` | Manejo global de errores |

### Frontend

| Archivo | Ubicación | Responsabilidad |
|---------|-----------|-----------------|
| `main.tsx` | `frontend/src/` | Bootstrap React |
| `App.tsx` | `frontend/src/` | Router principal |
| `api.ts` | `frontend/src/services/` | Cliente Axios configurado |
| `MainLayout.tsx` | `frontend/src/components/layout/` | Layout principal |
| `Dashboard.tsx` | `frontend/src/pages/` | Página inicial |
| `globals.css` | `frontend/src/styles/` | Estilos globales + Tailwind |

---

## Criterios de Aceptación (QA)

- [ ] `GET /api/v1/health` retorna `200` con `status: "healthy"`
- [ ] Frontend carga en `localhost:5173` sin errores de consola
- [ ] Dashboard muestra estado de conexión con el backend
- [ ] `pytest` pasa todas las pruebas del módulo
- [ ] `docker-compose up` levanta todos los servicios
- [ ] Swagger accesible en `/docs`

---

*Módulo 1 — CONTAIA PRO*
