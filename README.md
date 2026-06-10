# CONTAIA PRO

**Sistema Web de Gestión Empresarial y Contable con Inteligencia Artificial**

---

## 🏗️ Arquitectura

El proyecto tiene **dos backends** independientes:

- **Backend Node.js + Express** (`src/` y `app.js`) → APIs REST en `/api/v1/`
- **Backend Python + FastAPI** (`backend/app/`) → APIs REST alternativas
- **Frontend React + TypeScript** (`frontend/`) → Interface web
- **Servicio IA** (`backend/ai_service/`) → Predicciones y análisis

Todos comparten la misma **base de datos MySQL**.

## 📚 Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| **Backend Node.js** | Express.js, Node.js 18+, MySQL2 |
| **Backend Python** | FastAPI, SQLAlchemy 2.0, Alembic |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Base de datos** | MySQL 8.0+ |
| **Contenedores** | Docker, Docker Compose |

---

## 🚀 Inicio Rápido

### Backend Node.js + MySQL (Recomendado para desarrollo)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env con credenciales MySQL

# 3. Iniciar servidor
npm run dev
```

**URLs:**
- API: `http://localhost:3000/api/v1/`
- Health: `http://localhost:3000/api/v1/health`
- Login: `http://localhost:3000/api/v1/auth/login`

### Frontend React

```bash
cd frontend

npm install
npm run dev
```

**URL:** `http://localhost:5173`

### Backend Python + FastAPI (Opcional)

```bash
cd backend

python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Copiar configuración
copy .env.example .env

# Iniciar
uvicorn app.main:app --reload --port 8000
```

### Base de Datos MySQL

**Opción 1 — Docker:**
```bash
docker run -d \
  -e MYSQL_ROOT_PASSWORD=1122511176MvF. \
  -e MYSQL_DATABASE=bsproyecto \
  -p 3306:3306 \
  mysql:8.0
```

**Opción 2 — MySQL instalado localmente:**
```bash
mysql -u root -p
> CREATE DATABASE bsproyecto;
```

**Opción 3 — Cargar script SQL:**
```bash
mysql -u root -p bsproyecto < init-database.sql
```

---

## 🔑 Usuarios de Prueba

Se crean automáticamente al iniciar el servidor Node.js:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@contaia.com | Admin123! | Administrador |
| contador@contaia.com | Contador123! | Contador |
| empleado@contaia.com | Empleado123! | Empleado |
| gerente@contaia.com | Gerente123! | Gerente |

---

## 📋 Configuración (.env)

```env
# General
NODE_ENV=development
PORT=3000
APP_NAME=CONTAIA PRO

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=bsproyecto

# JWT
JWT_SECRET=cambiar_en_produccion
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# IA Service
AI_SERVICE_URL=http://localhost:5001
```

---

## 📂 Estructura de Carpetas

```
.
├── src/                          # Backend Node.js
│   ├── config/                   # Configuración
│   ├── controllers/              # Controladores HTTP
│   ├── middleware/               # Middlewares (auth, errores)
│   ├── models/                   # Modelos del dominio
│   ├── repositories/             # Capa de datos (MySQL)
│   ├── routes/                   # Rutas de API
│   ├── services/                 # Lógica de negocio
│   ├── utils/                    # Funciones auxiliares
│   ├── validators/               # Validación de datos
│   └── core/
│       └── database.js           # Pool MySQL + inicialización
├── frontend/                     # React + TypeScript
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── pages/                # Páginas de la app
│   │   ├── services/             # Cliente HTTP (Axios)
│   │   ├── stores/               # Estado global (Auth)
│   │   └── types/                # Tipos TypeScript
│   └── vite.config.ts
├── backend/                      # Python + FastAPI (alternativo)
│   ├── app/                      # App principal FastAPI
│   ├── ai_service/               # Servicio IA (Flask)
│   └── requirements.txt
├── docs/                         # Documentación técnica
├── data/                         # (Legado) JSON
├── app.js                        # Configuración Express
├── server.js                     # Punto de entrada
├── package.json
├── .env                          # Variables de entorno
├── .env.example
├── init-database.sql             # Script SQL
├── docker-compose.yml
└── MIGRACION_JSON_TO_MYSQL.md    # Guía de migración

```

---

## 🗄️ Base de Datos

### Tablas Principales

- **roles** — Definición de roles y permisos
- **users** — Usuarios del sistema
- **products** — Catálogo de productos
- **clients** — Clientes
- **invoices** — Facturas
- **incomes** — Ingresos
- **expenses** — Gastos
- **inventory_movements** — Movimientos de inventario
- **token_blacklist** — Tokens invalidados (logout)

### Inicialización Automática

El servidor Node.js crea las tablas automáticamente al iniciar:

```bash
npm run dev
# ✓ Conexión a MySQL establecida
# ✓ Base de datos inicializada
# ✓ Roles del sistema creados
# ✓ Usuarios de prueba creados
```

---

## 📡 Endpoints Principales

### Autenticación
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/profile
```

### Usuarios
```
GET    /api/v1/users
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

### Productos
```
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

### Clientes
```
GET    /api/v1/clients
POST   /api/v1/clients
PUT    /api/v1/clients/:id
DELETE /api/v1/clients/:id
```

### Inventario
```
GET    /api/v1/inventory
POST   /api/v1/inventory
```

### Facturas
```
GET    /api/v1/invoices
POST   /api/v1/invoices
PUT    /api/v1/invoices/:id
```

### Ingresos / Gastos
```
GET    /api/v1/income
POST   /api/v1/income
GET    /api/v1/expenses
POST   /api/v1/expenses
```

---

## 🧪 Pruebas

```bash
# Backend Node.js
npm test

# Backend Python
cd backend
pytest
```

---

## 🐳 Docker Compose

Para correr todo junto:

```bash
docker-compose up -d
```

Detener:
```bash
docker-compose down
```

---

## 📖 Documentación

- [`TODO-CODIGO-EXPLICADO.md`](docs/TODO-CODIGO-EXPLICADO.md) — Guía completa del código
- [`MIGRACION_JSON_TO_MYSQL.md`](MIGRACION_JSON_TO_MYSQL.md) — Migración de JSON a MySQL
- [`docs/01-ARQUITECTURA.md`](docs/01-ARQUITECTURA.md) — Arquitectura del proyecto
- [`docs/06-MODULO-AUTENTICACION.md`](docs/06-MODULO-AUTENTICACION.md) — Sistema de autenticación

---

## 🔧 Troubleshooting

### Error: Cannot connect to MySQL

```bash
# Verifica que MySQL esté corriendo
mysql -u root -p -e "SELECT VERSION();"

# Verifica las credenciales en .env
cat .env | grep MYSQL

# Reinicia MySQL
sudo systemctl restart mysql
```

### Error: Port 3000 already in use

```bash
# Cambia el puerto en .env
PORT=3001

# O mata el proceso usando el puerto (Linux/Mac)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Error: Database not found

```bash
# Crea la base de datos manualmente
mysql -u root -p bsproyecto < init-database.sql
```

---

## 📝 Variables de Entorno Importantes

| Variable | Descripción | Default |
|----------|------------|---------|
| `NODE_ENV` | development / production | development |
| `PORT` | Puerto del servidor Node | 3000 |
| `MYSQL_HOST` | Host de MySQL | localhost |
| `MYSQL_USER` | Usuario MySQL | root |
| `MYSQL_PASSWORD` | Contraseña MySQL | (requerido) |
| `MYSQL_DATABASE` | Base de datos | bsproyecto |
| `JWT_SECRET` | Secreto para tokens | (requerido) |
| `CORS_ORIGINS` | Orígenes CORS permitidos | localhost:5173 |

---

## 📞 Soporte

Para dudas o problemas:

1. Revisa [`TODO-CODIGO-EXPLICADO.md`](docs/TODO-CODIGO-EXPLICADO.md)
2. Revisa [`MIGRACION_JSON_TO_MYSQL.md`](MIGRACION_JSON_TO_MYSQL.md)
3. Abre un issue en el repositorio
4. Contacta al equipo de desarrollo

---

**Última actualización:** 2024
**Versión:** 1.0.0
| 3 | Gestión de Empresas | Pendiente |
| 4+ | Contabilidad, Facturación, IA... | Pendiente |

## Documentación

- [Arquitectura](docs/01-ARQUITECTURA.md)
- [Módulo 1 — Fundación](docs/02-MODULO-01-FUNDACION.md)

---

© 2026 CONTAIA PRO
#   p r o y e c t o S e n a 
 
 #   p r o y e c t o S e n a 
 
 