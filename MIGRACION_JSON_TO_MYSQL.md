# 📚 Migración: JSON → MySQL

## ✅ Cambios Realizados

Este documento explica la migración del backend Node.js de **almacenamiento JSON** a **MySQL**.

### 1. **Instalación de dependencias**
- ✅ Agregado `mysql2` v3.11.3 al `package.json`

### 2. **Configuración MySQL**
- ✅ Variables en `.env`:
  ```
  MYSQL_HOST=localhost
  MYSQL_PORT=3306
  MYSQL_USER=root
  MYSQL_PASSWORD=1122511176MvF.
  MYSQL_DATABASE=bsproyecto
  ```
- ✅ Actualizado `src/config/index.js` para leer variables MySQL

### 3. **Capa de Base de Datos**
- ✅ Creado `src/core/database.js`:
  - Pool de conexiones
  - Inicialización automática de tablas
  - Manejo de conexiones
  - Función `query()` para ejecutar SQL

### 4. **Repositorio Base**
- ✅ Creado `src/repositories/BaseRepository.js`:
  - Operaciones CRUD genéricas
  - `findById()`, `findAll()`, `findWhere()`, `findOne()`
  - `create()`, `update()`, `delete()`
  - `executeQuery()` para consultas personalizadas
  - `count()` para contar registros

### 5. **Migración de Repositorios**
Todos los repositorios ahora usan MySQL:

- ✅ `userRepository.js` → Tabla `users`
- ✅ `roleRepository.js` → Tabla `roles`
- ✅ `clientRepository.js` → Tabla `clients`
- ✅ `productRepository.js` → Tabla `products`
- ✅ `incomeRepository.js` → Tabla `incomes`
- ✅ `expenseRepository.js` → Tabla `expenses`
- ✅ `inventoryRepository.js` → Tabla `inventory_movements`
- ✅ `invoiceRepository.js` → Tabla `invoices`

### 6. **Tablas Creadas Automáticamente**

Cuando inicia el servidor, se crean estas tablas:

```sql
-- Roles
CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Usuarios
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  document VARCHAR(50),
  role VARCHAR(100),
  roleId VARCHAR(36),
  companyId VARCHAR(36),
  isActive BOOLEAN DEFAULT true,
  lastLoginAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Token Blacklist (para logout)
CREATE TABLE token_blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(1000) NOT NULL,
  expiresAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Productos
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  cost DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  quantity INT DEFAULT 0,
  unit VARCHAR(50),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Clientes
CREATE TABLE clients (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  country VARCHAR(100),
  document VARCHAR(50),
  companyName VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Movimientos de Inventario
CREATE TABLE inventory_movements (
  id VARCHAR(36) PRIMARY KEY,
  productId VARCHAR(36) NOT NULL,
  type VARCHAR(20),
  quantity INT,
  reason VARCHAR(255),
  reference VARCHAR(100),
  createdBy VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Facturas
CREATE TABLE invoices (
  id VARCHAR(36) PRIMARY KEY,
  number VARCHAR(50) UNIQUE NOT NULL,
  clientId VARCHAR(36),
  date DATE,
  dueDate DATE,
  items JSON,
  subtotal DECIMAL(12, 2),
  tax DECIMAL(12, 2),
  total DECIMAL(12, 2),
  status VARCHAR(50),
  notes TEXT,
  createdBy VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Ingresos
CREATE TABLE incomes (
  id VARCHAR(36) PRIMARY KEY,
  description VARCHAR(255),
  amount DECIMAL(12, 2),
  date DATE,
  category VARCHAR(100),
  source VARCHAR(100),
  reference VARCHAR(100),
  notes TEXT,
  createdBy VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Gastos
CREATE TABLE expenses (
  id VARCHAR(36) PRIMARY KEY,
  description VARCHAR(255),
  amount DECIMAL(12, 2),
  date DATE,
  category VARCHAR(100),
  vendor VARCHAR(100),
  reference VARCHAR(100),
  notes TEXT,
  createdBy VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### 7. **Servidor Actualizado**
- ✅ `server.js` ahora:
  - Inicializa la base de datos con `initializeDatabase()`
  - Cierra el pool de conexiones al apagar (`closePool()`)
  - Siembra roles del sistema
  - Siembra usuarios de prueba

### 8. **Datos de Prueba**
Se crean automáticamente al iniciar:

**Usuarios:**
- admin@contaia.com / Admin123!
- contador@contaia.com / Contador123!
- empleado@contaia.com / Empleado123!
- gerente@contaia.com / Gerente123!

**Roles:**
- ADMINISTRADOR
- CONTADOR
- EMPLEADO
- GERENTE

---

## 🚀 Cómo usar

### 1. **Instalar dependencias**
```bash
npm install
```

### 2. **Configurar MySQL**
Asegúrate de que MySQL esté corriendo:
```bash
mysql -u root -p
```

Crea la base de datos (opcional, se crea automáticamente):
```sql
CREATE DATABASE bsproyecto;
```

### 3. **Configurar .env**
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=bsproyecto
JWT_SECRET=tu_secreto_aqui
```

### 4. **Iniciar el servidor**
```bash
npm run dev
```

El servidor:
- Conectará a MySQL
- Creará las tablas automáticamente
- Sembrará datos de prueba
- Escuchará en `http://localhost:3000`

---

## 📝 Cambios en la API

**La API es la misma**, pero ahora:
- ✅ Los datos se guardan en MySQL (no en JSON)
- ✅ Es más rápido con índices de base de datos
- ✅ Soporta transacciones
- ✅ Es escalable para múltiples servidores
- ✅ Compatible con `backend/app/` (FastAPI + MySQL)

---

## 🗑️ Archivos JSON eliminados

Los siguientes archivos ya NO se usan:
- `data/users.json`
- `data/roles.json`
- `data/incomes.json`
- `data/expenses.json`
- `data/products.json`
- `data/clients.json`
- `data/invoices.json`
- `data/inventory-movements.json`
- `data/token-blacklist.json`

*Nota: Puedes mantener la carpeta `data/` si quieres guardar backups.*

---

## ✨ Beneficios

| Aspecto | JSON | MySQL |
|--------|------|-------|
| **Velocidad** | Lento para muchos datos | Rápido con índices |
| **Escalabilidad** | Limitado | Excelente |
| **Concurrencia** | No soporta bien | Transacciones ACID |
| **Seguridad** | Básica | Contraseñas + permisos |
| **Respaldos** | Manual | Automático |
| **Búsquedas** | O(n) | O(log n) con índices |

---

## 📞 Soporte

Si tienes problemas:

1. **Verifica la conexión MySQL:**
   ```bash
   mysql -u root -p -h localhost
   ```

2. **Verifica el .env:**
   ```bash
   cat .env
   ```

3. **Revisa los logs del servidor:**
   ```bash
   npm run dev
   ```

4. **Verifica que MySQL esté corriendo:**
   ```bash
   mysql -u root -p -e "SELECT VERSION();"
   ```

---

**¡Migración completada! 🎉**
