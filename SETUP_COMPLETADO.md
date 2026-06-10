# ✅ Migración Completada: JSON → MySQL

## 📋 Resumen de Cambios

He convertido exitosamente el backend Node.js de **almacenamiento JSON** a **MySQL**. 

---

## 📦 Lo que se instaló

✅ **mysql2** v3.11.3 - Driver MySQL para Node.js

---

## 📁 Archivos Nuevos Creados

1. **`.env`** — Archivo de configuración con credenciales MySQL
2. **`.env.example`** — Template de variables de entorno  
3. **`src/core/database.js`** — Conexión y pool MySQL
4. **`src/repositories/BaseRepository.js`** — Clase base para operaciones CRUD
5. **`init-database.sql`** — Script SQL de inicialización
6. **`test-db.js`** — Script de prueba de conexión
7. **`MIGRACION_JSON_TO_MYSQL.md`** — Documentación completa
8. **`README.md`** (actualizado) — Guía de inicio

---

## 📝 Archivos Modificados

### Configuración
- ✅ **`package.json`** — Agregado mysql2 y script test-db
- ✅ **`src/config/index.js`** — Nuevas variables MySQL
- ✅ **`server.js`** — Inicializa la BD y cierra el pool

### Repositorios (Migrados a MySQL)
- ✅ **`src/repositories/userRepository.js`** → Tabla `users`
- ✅ **`src/repositories/roleRepository.js`** → Tabla `roles`
- ✅ **`src/repositories/clientRepository.js`** → Tabla `clients`
- ✅ **`src/repositories/productRepository.js`** → Tabla `products`
- ✅ **`src/repositories/incomeRepository.js`** → Tabla `incomes`
- ✅ **`src/repositories/expenseRepository.js`** → Tabla `expenses`
- ✅ **`src/repositories/inventoryRepository.js`** → Tabla `inventory_movements`
- ✅ **`src/repositories/invoiceRepository.js`** → Tabla `invoices`

---

## 🚀 Próximos Pasos

### 1. Asegúrate que MySQL esté corriendo

**Opción A - Windows (XAMPP, WAMP, etc.):**
```bash
# Inicia el servicio MySQL desde el panel de control
```

**Opción B - Docker:**
```bash
docker run -d \
  --name mysql-contaia \
  -e MYSQL_ROOT_PASSWORD=1122511176MvF. \
  -e MYSQL_DATABASE=bsproyecto \
  -p 3306:3306 \
  mysql:8.0
```

**Opción C - Verificar conexión:**
```bash
mysql -u root -p -e "SELECT VERSION();"
```

### 2. Prueba la conexión a la BD

```bash
npm run test-db
```

Deberías ver:
```
✅ Conexión al pool establecida
✅ Consulta de prueba exitosa
✓ roles
✓ users
✓ products
...
✨ ¡Todo está configurado correctamente!
```

### 3. Inicia el servidor

```bash
npm run dev
```

Deberías ver:
```
✓ Conexión a MySQL establecida
✓ Base de datos inicializada
✔ Roles del sistema creados
✔ Usuarios de prueba creados

─────────────────────────────────────
  CONTAIA PRO v1.0.0
  Entorno: development
  URL:     http://localhost:3000
  Health:  http://localhost:3000/api/v1/health
─────────────────────────────────────
```

### 4. Inicia el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre: `http://localhost:5173`

---

## 🔐 Credenciales de Prueba

Se crean automáticamente:

```
admin@contaia.com / Admin123!
contador@contaia.com / Contador123!
empleado@contaia.com / Empleado123!
gerente@contaia.com / Gerente123!
```

---

## 📊 Tabla de Migración

| Aspecto | Antes (JSON) | Ahora (MySQL) |
|---------|-------------|---------------|
| Almacenamiento | Archivos en `data/` | Base de datos |
| Velocidad | O(n) | O(log n) con índices |
| Escalabilidad | Limitada | Excelente |
| Concurrencia | Débil | ACID transactions |
| Respaldos | Manual | Automático |
| Multi-servidor | No | Sí |

---

## ⚙️ Configuración Recomendada para Desarrollo

### `.env` completo:

```env
# General
NODE_ENV=development
PORT=3000
APP_NAME=CONTAIA PRO
APP_VERSION=1.0.0

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=1122511176MvF.
MYSQL_DATABASE=bsproyecto

# JWT
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
JWT_RESET_EXPIRES_IN=15m

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# IA Service
AI_SERVICE_URL=http://localhost:5001

# Logging
LOG_LEVEL=info

# Cookies
COOKIE_SECURE=false
```

---

## 🆘 Troubleshooting

### Error: `connect ECONNREFUSED 127.0.0.1:3306`

**Causa:** MySQL no está corriendo

**Solución:**
```bash
# Windows - Inicia MySQL desde servicios
net start MySQL80  # O tu versión

# Linux
sudo systemctl start mysql

# Docker
docker start mysql-contaia
```

### Error: `Access denied for user 'root'@'localhost'`

**Causa:** Contraseña incorrecta

**Solución:**
```bash
# Verifica la contraseña en .env
cat .env | grep MYSQL_PASSWORD

# O intenta conectar manualmente
mysql -u root -p -h localhost
```

### Error: `database bsproyecto doesn't exist`

**Solución:** Ejecuta el script SQL:
```bash
mysql -u root -p bsproyecto < init-database.sql
```

O créala manualmente:
```bash
mysql -u root -p -e "CREATE DATABASE bsproyecto;"
```

---

## 📚 Documentación Completa

Revisa estos archivos para más detalles:

- **[MIGRACION_JSON_TO_MYSQL.md](MIGRACION_JSON_TO_MYSQL.md)** ← Guía técnica
- **[README.md](README.md)** ← Inicio rápido
- **[docs/TODO-CODIGO-EXPLICADO.md](docs/TODO-CODIGO-EXPLICADO.md)** ← Explicación completa

---

## ✨ Lo que cambió en la arquitectura

**Antes:**
```
Cliente → Express → Controlador → Servicio → JsonRepository → Archivo JSON
```

**Ahora:**
```
Cliente → Express → Controlador → Servicio → MySQLRepository → MySQL
```

---

## 🎯 Verifica que funciona

1. Prueba health check:
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

2. Intenta login:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@contaia.com","password":"Admin123!"}'
   ```

3. Abre el frontend:
   ```
   http://localhost:5173
   ```

---

## 🎉 ¡Listo!

El backend Node.js ahora usa **MySQL** en lugar de JSON.

- ✅ Más rápido
- ✅ Más seguro  
- ✅ Más escalable
- ✅ Compatible con backend Python

**¡Próximo paso: Integrar ambos backends si es necesario!**
