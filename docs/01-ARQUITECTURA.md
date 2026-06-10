# CONTAIA PRO — Documentación de Arquitectura

## 1. Visión del Sistema

**CONTAIA PRO** es un sistema web de gestión empresarial y contable con inteligencia artificial, diseñado para producción y escalabilidad horizontal.

| Atributo | Valor |
|----------|-------|
| Arquitectura | MVC + Capas (Controller → Service → Repository → Model) |
| Backend | Python 3.11+ / FastAPI |
| Frontend | React 18 / TypeScript / Vite |
| Base de datos | MySQL 8.1 |
| Cache | Redis (módulos posteriores) |
| IA | OpenAI API / modelos locales (módulo dedicado) |
| Contenedores | Docker + Docker Compose |

---

## 2. Decisiones Arquitectónicas (Equipo)

### Arquitecto de Software
- **Monorepo** con separación clara `backend/` y `frontend/`.
- **API REST versionada** (`/api/v1/`) para evolución sin romper clientes.
- **Inyección de dependencias** vía FastAPI `Depends()` — cumple SOLID (DIP).
- **Repository Pattern** para desacoplar persistencia de lógica de negocio.

### Analista de Sistemas
- Multi-empresa (multi-tenant) planificado desde el diseño.
- Módulos funcionales independientes pero con contratos compartidos.
- Auditoría y trazabilidad en todos los módulos transaccionales.

### Especialista en Seguridad
- Variables sensibles solo en `.env` (nunca en código).
- CORS restrictivo en producción.
- Preparación para JWT + RBAC (Módulo 2).
- Headers de seguridad vía middleware.

### Especialista en IA
- Servicio de IA desacoplado como capa independiente (Módulo 8).
- Contexto empresarial inyectado vía servicios, no directamente en controladores.

---

## 3. Mapa de Módulos

| # | Módulo | Estado | Descripción |
|---|--------|--------|-------------|
| 1 | **Fundación e Infraestructura** | ✅ En desarrollo | Estructura, config, health, layout base |
| 2 | Autenticación y Seguridad | Pendiente | JWT, roles, RBAC, sesiones |
| 3 | Gestión de Empresas | Pendiente | Multi-tenant, sucursales |
| 4 | Plan de Cuentas | Pendiente | Catálogo contable NIIF/local |
| 5 | Asientos Contables | Pendiente | Libro diario, mayor |
| 6 | Facturación | Pendiente | Facturas, notas crédito/débito |
| 7 | Inventario | Pendiente | Productos, kardex, bodegas |
| 8 | Reportes Financieros | Pendiente | Balance, P&G, flujo de caja |
| 9 | Inteligencia Artificial | Pendiente | Asistente, análisis, predicciones |
| 10 | Dashboard Ejecutivo | Pendiente | KPIs, gráficos en tiempo real |

> **Regla:** No se avanza al siguiente módulo hasta completar el actual.

---

## 4. Estructura de Directorios

```
contaia-pro/
├── backend/                    # API REST (Python/FastAPI)
│   ├── app/
│   │   ├── config/             # Configuración (Settings)
│   │   ├── core/               # DB, logging, excepciones, seguridad base
│   │   ├── models/             # Modelos ORM (SQLAlchemy)
│   │   ├── schemas/            # DTOs / validación (Pydantic) — "Vista" de datos
│   │   ├── controllers/        # Controladores HTTP — capa "C"
│   │   ├── services/           # Lógica de negocio — capa "M" (Modelo de dominio)
│   │   ├── repositories/       # Acceso a datos
│   │   └── middleware/         # Cross-cutting concerns
│   ├── alembic/                # Migraciones de BD
│   ├── tests/                  # Pruebas unitarias e integración
│   └── requirements.txt
├── frontend/                   # SPA (React/TypeScript)
│   └── src/
│       ├── components/         # Componentes reutilizables
│       ├── pages/              # Vistas por ruta
│       ├── services/           # Cliente API
│       ├── hooks/              # Custom hooks
│       ├── types/              # Tipos TypeScript
│       └── utils/              # Utilidades
├── docs/                       # Documentación técnica
├── docker-compose.yml
└── README.md
```

---

## 5. Flujo MVC en Backend

```
HTTP Request
    ↓
Controller  →  valida entrada (Schema), delega al Service
    ↓
Service     →  lógica de negocio, orquesta Repositories
    ↓
Repository  →  consultas/persistencia ORM
    ↓
Model       →  entidad SQLAlchemy
    ↓
Schema      →  serializa respuesta JSON ("Vista")
```

---

## 6. Principios SOLID Aplicados

| Principio | Implementación |
|-----------|----------------|
| **S** — Single Responsibility | Cada clase tiene una responsabilidad (Controller ≠ Service ≠ Repository) |
| **O** — Open/Closed | Servicios extensibles vía interfaces/base classes |
| **L** — Liskov Substitution | `BaseRepository` sustituible por repositorios concretos |
| **I** — Interface Segregation | Schemas Pydantic específicos por operación (Create/Update/Response) |
| **D** — Dependency Inversion | Controllers dependen de abstracciones vía `Depends()` |

---

## 7. Convenciones de Código

- **Python:** PEP 8, type hints, docstrings en servicios públicos.
- **TypeScript:** strict mode, interfaces para contratos API.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`).
- **Ramas:** `main` (producción), `develop` (integración), `feature/modulo-X`.

---

## 8. Variables de Entorno

Ver `backend/.env.example` y `frontend/.env.example`.

---


