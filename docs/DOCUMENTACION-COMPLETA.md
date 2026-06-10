# DOCUMENTACIÓN COMPLETA — CONTAIA PRO

> Sistema Web de Gestión Empresarial y Contable con IA  
> Stack: Node.js + Express (backend) · React + TypeScript (frontend) · JSON (base de datos)

---

## TABLA DE CONTENIDO

1. [¿Qué es este proyecto?](#1-qué-es-este-proyecto)
2. [Tecnologías y lenguajes](#2-tecnologías-y-lenguajes)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Raíz del proyecto](#4-raíz-del-proyecto)
5. [Backend — carpeta por carpeta](#5-backend--carpeta-por-carpeta)
6. [Frontend — carpeta por carpeta](#6-frontend--carpeta-por-carpeta)
7. [Base de datos JSON](#7-base-de-datos-json)
8. [Paquetes del backend explicados](#8-paquetes-del-backend-explicados)
9. [Paquetes del frontend explicados](#9-paquetes-del-frontend-explicados)
10. [Flujo completo de una petición](#10-flujo-completo-de-una-petición)
11. [Sistema de autenticación y JWT](#11-sistema-de-autenticación-y-jwt)
12. [Sistema de roles y permisos](#12-sistema-de-roles-y-permisos)
13. [Cómo correr el proyecto](#13-cómo-correr-el-proyecto)

---

## 1. ¿QUÉ ES ESTE PROYECTO?

CONTAIA PRO es una aplicación web empresarial que permite gestionar:

- **Usuarios** con roles y permisos distintos
- **Clientes y proveedores**
- **Productos e inventario**
- **Facturas, ingresos y gastos**
- **Reportes financieros**
- **Asistente de Inteligencia Artificial**

Es una aplicación de tipo **SPA (Single Page Application)**: el frontend es una app React que corre en el navegador y se comunica con el backend a través de una API REST.

---

## 2. TECNOLOGÍAS Y LENGUAJES

### JavaScript (Node.js) — Backend
JavaScript es el lenguaje de programación del backend. Corre sobre **Node.js**, que permite ejecutar JavaScript fuera del navegador, en el servidor. Se usa la sintaxis moderna **ES Modules** (`import`/`export`) en lugar de la antigua `require()`.

**¿Por qué JavaScript en el backend?**
- El mismo lenguaje en frontend y backend (menos cambio de contexto mental)
- Node.js es muy rápido para operaciones de red (I/O no bloqueante)
- Ecosistema enorme de paquetes en npm

### TypeScript — Frontend
TypeScript es JavaScript con tipos. Eso significa que cuando escribes código, el editor detecta errores antes de ejecutar la aplicación. Por ejemplo, si una función espera un número y tú le pasas un texto, TypeScript lo marca como error inmediatamente.

**¿Por qué TypeScript en el frontend?**
- Detecta errores en tiempo de desarrollo, no en producción
- Mejor autocompletado en el editor
- El código es más legible porque cada variable tiene un tipo declarado

### React — Interfaz de usuario
React es una librería de JavaScript para construir interfaces de usuario. En lugar de manipular el HTML directamente, React trabaja con **componentes**: piezas reutilizables de interfaz (un botón, un formulario, una tabla) que se combinan para formar pantallas completas.

**¿Por qué React?**
- Componentes reutilizables (el botón de "Guardar" se crea una vez y se usa en todos lados)
- Actualiza solo lo que cambió en la pantalla, no recarga toda la página
- El ecosistema más grande del frontend

### Express — Servidor HTTP
Express es el framework de Node.js para crear servidores web. Maneja las rutas (`/api/v1/auth/login`), los middlewares y las respuestas HTTP.

**¿Por qué Express?**
- Minimalista: tú decides cómo estructurar el proyecto
- Maduro y probado en producción por millones de apps
- Fácil de aprender y extender

### JSON como base de datos
Los datos se guardan en archivos `.json` dentro de la carpeta `/data`. Cada archivo es como una tabla de base de datos: un array de objetos.

**¿Por qué JSON en vez de MySQL?**
- No requiere instalar ni configurar un servidor de base de datos
- Funciona en cualquier computador sin instalación adicional
- Perfecto para proyectos de aprendizaje y prototipos
- Los datos son legibles directamente con cualquier editor

---

## 3. ESTRUCTURA DE CARPETAS

```
sena valentina/                 ← Raíz del proyecto
├── server.js                   ← Punto de entrada del backend
├── app.js                      ← Configuración de Express
├── package.json                ← Dependencias y scripts del backend
├── .env                        ← Variables de entorno (secretos)
├── .env.example                ← Plantilla del .env sin valores reales
├── .gitignore                  ← Archivos que Git ignora
├── docker-compose.yml          ← Configuración para Docker
│
├── src/                        ← Código fuente del backend
│   ├── config/                 ← Configuración centralizada
│   ├── controllers/            ← Manejan las peticiones HTTP
│   ├── middleware/             ← Funciones que interceptan peticiones
│   ├── models/                 ← Clases que representan los datos
│   ├── repositories/           ← Acceso a los datos (JSON)
│   ├── routes/                 ← Definición de rutas de la API
│   ├── services/               ← Lógica de negocio
│   └── utils/                  ← Funciones auxiliares reutilizables
│
├── data/                       ← Base de datos JSON
│   ├── users.json
│   ├── roles.json
│   ├── incomes.json
│   ├── expenses.json
│   ├── clients.json
│   ├── products.json
│   ├── invoices.json
│   ├── inventory.json
│   └── token-blacklist.json
│
├── frontend/                   ← Aplicación React
│   ├── src/                    ← Código fuente del frontend
│   │   ├── components/         ← Componentes reutilizables de UI
│   │   ├── pages/              ← Pantallas completas
│   │   ├── services/           ← Llamadas a la API
│   │   ├── stores/             ← Estado global (sesión del usuario)
│   │   ├── routes/             ← Control de acceso a rutas
│   │   ├── types/              ← Tipos TypeScript
│   │   ├── hooks/              ← Lógica reutilizable con React
│   │   ├── utils/              ← Constantes y utilidades
│   │   └── styles/             ← Estilos globales CSS
│   ├── package.json            ← Dependencias del frontend
│   ├── vite.config.ts          ← Configuración de Vite
│   └── index.html              ← Página HTML base
│
├── docs/                       ← Documentación del proyecto
├── backend/                    ← Microservicio de IA (Python/FastAPI)
└── data/                       ← Archivos JSON (base de datos)
```

---

## 4. RAÍZ DEL PROYECTO

### `server.js`
Es el **punto de entrada** de toda la aplicación. Cuando ejecutas `node server.js` o `npm run dev`, este archivo es el primero en ejecutarse.

Lo que hace:
1. Carga los repositorios (acceso a los JSON)
2. Ejecuta el "seed" inicial: si los archivos JSON están vacíos, crea los roles y usuarios de prueba
3. Llama a `app.listen()` para que Express empiece a escuchar peticiones en el puerto 3000
4. Configura el cierre ordenado del servidor cuando se presiona Ctrl+C

```js
// Seed inicial — crea datos si los archivos están vacíos
await roleRepository.seedSystemRoles();
await userRepository.seedIfEmpty();

// Levanta el servidor HTTP en el puerto 3000
const server = app.listen(config.port, () => { ... });
```

### `app.js`
Configura Express: qué middlewares usar, qué rutas registrar, cómo manejar errores. Es una separación de responsabilidades: `server.js` levanta el servidor, `app.js` lo configura.

### `package.json` (raíz)
Define el proyecto backend: nombre, versión, scripts de npm y dependencias.

**Scripts disponibles:**
| Script | Qué hace |
|--------|----------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Levanta backend + frontend simultáneamente |
| `npm run dev:backend` | Solo el backend con nodemon |
| `npm run dev:frontend` | Solo el frontend con Vite |

### `.env`
Archivo de **variables de entorno**. Contiene configuración que cambia entre entornos (desarrollo, producción) y secretos que no deben subirse a GitHub. Por eso está en `.gitignore`.

Variables principales:
```
PORT=3000                    ← Puerto donde corre el servidor
JWT_SECRET=...               ← Clave para firmar tokens JWT
JWT_EXPIRES_IN=1h            ← Cuánto tiempo dura un token de acceso
CORS_ORIGINS=http://...      ← Qué dominios pueden hacer peticiones
```

### `.gitignore`
Lista de archivos y carpetas que Git no debe rastrear. Incluye `node_modules/` (miles de archivos de paquetes), `.env` (secretos) y archivos de compilación.

---

## 5. BACKEND — CARPETA POR CARPETA

### `src/config/`

**¿Para qué sirve?** Centraliza toda la configuración del sistema en un solo lugar. En vez de leer `process.env.JWT_SECRET` en 20 archivos distintos, lo lees una vez aquí y lo exportas como `config.jwtSecret`.

---

#### `src/config/index.js`
Lee las variables del archivo `.env` usando `dotenv` y las exporta como un objeto `config`. Si una variable no está definida, usa un valor por defecto.

```js
export const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  // ...
};
```

**¿Por qué centralizar la configuración?**
Si mañana cambias el nombre de una variable de entorno, solo lo cambias en un lugar, no en todo el proyecto.

---

#### `src/config/permissions.js`
Define todos los permisos que existen en el sistema usando un catálogo. Cada permiso tiene el formato `recurso:acción`, por ejemplo `income:write` o `users:manage`.

El catálogo completo es un array que describe cada permiso con su módulo y descripción legible, útil para mostrarlo en la interfaz al administrador.

---

#### `src/config/roles.js`
Define los 4 roles del sistema y qué permisos tiene cada uno:

| Rol | Acceso |
|-----|--------|
| **Administrador** | Todo el sistema |
| **Contador** | Finanzas, clientes, facturas, reportes |
| **Empleado** | Operaciones básicas, sin reportes ni gestión de usuarios |
| **Gerente** | Vista de solo lectura de casi todo, más reportes |

---

#### `src/config/restrictions.js`
Reglas de negocio sobre los roles: si los roles del sistema se pueden borrar, si el Administrador debe mantener ciertos permisos obligatorios, etc.

---

### `src/models/`

**¿Para qué sirven los modelos?** Representan las entidades del negocio como clases de JavaScript. En vez de trabajar con objetos planos `{ id: "...", email: "..." }`, usas instancias de `User` que tienen métodos como `toJSON()` o `toStorage()`.

Ventajas:
- Lógica asociada a los datos en un solo lugar
- `toJSON()` controla exactamente qué campos se envían al frontend (por ejemplo, nunca envía `passwordHash`)
- `toStorage()` controla qué campos se guardan en el JSON

---

#### `src/models/BaseModel.js`
Clase base de la que heredan casi todos los modelos. Agrega los campos comunes de auditoría:
- `id` — identificador único
- `createdAt` — fecha de creación
- `updatedAt` — fecha de última modificación
- `isActive` — si el registro está activo (borrado lógico)
- `createdBy` / `updatedBy` — quién lo creó/modificó

---

#### `src/models/User.js`
Representa un usuario del sistema. Puntos importantes:

- El campo `passwordHash` es el hash bcrypt de la contraseña, nunca la contraseña en texto plano
- El getter `fullName` combina `firstName` + `lastName` automáticamente
- `toJSON()` excluye `passwordHash` — el frontend nunca recibe la contraseña
- `setPermissions()` permite asignar los permisos resueltos desde el rol

---

#### `src/models/Role.js`
Representa un rol. El campo `permissions` es un array de strings como `["income:read", "income:write"]`. El campo `isSystem: true` indica que es un rol predefinido que no se puede borrar.

---

#### `src/models/Income.js`, `Expense.js`, `Client.js`, `Product.js`
Todos extienden `BaseModel` y agregan sus campos específicos. Por ejemplo, `Income` tiene `concept` (descripción del ingreso) y `value` (monto).

---

### `src/repositories/`

**¿Para qué sirven los repositorios?** Son la única capa del código que toca directamente los datos. Si mañana cambias de JSON a una base de datos real, solo cambias los repositorios — el resto del código no sabe ni le importa cómo se guardan los datos.

Este patrón se llama **Repository Pattern** y es una buena práctica de arquitectura.

---

#### `src/repositories/JsonRepository.js`
Es la clase base de todos los repositorios. Contiene los métodos para leer y escribir archivos JSON:

| Método | Qué hace |
|--------|----------|
| `findAll()` | Devuelve todos los registros del archivo |
| `findById(id)` | Busca un registro por su ID |
| `findOne(fn)` | Devuelve el primer registro que cumpla una condición |
| `filter(fn)` | Devuelve todos los registros que cumplan una condición |
| `save(record)` | Guarda un registro (crea si no existe, actualiza si existe) |
| `deleteById(id)` | Elimina un registro por ID |
| `_paginate(items, page, limit)` | Divide un array grande en páginas |

El método `save()` hace un **upsert**: busca por `id` y si lo encuentra actualiza, si no lo encuentra crea uno nuevo. Así el código de los repositorios hijos es más simple.

---

#### `src/repositories/userRepository.js`
Maneja los usuarios en `data/users.json` y los tokens blacklist en `data/token-blacklist.json`.

Métodos clave:
- `seedIfEmpty()` — crea 4 usuarios de prueba si el archivo está vacío
- `findByEmail()` — busca usuario por email (usado en el login)
- `addToBlacklist()` — guarda un token revocado al hacer logout
- `isBlacklisted()` — verifica si un token fue revocado

---

#### `src/repositories/roleRepository.js`
Maneja los roles en `data/roles.json`.

- `seedSystemRoles()` — crea los 4 roles del sistema si el archivo está vacío
- `findByName()` — busca un rol por nombre (usado al crear usuarios)

---

### `src/services/`

**¿Para qué sirven los services?** Contienen la **lógica de negocio**. Un controller recibe la petición HTTP, llama al service, y el service decide qué hacer: validar datos, coordinar repositorios, lanzar errores, etc.

Esta separación permite que la lógica de negocio sea independiente de HTTP — podría reutilizarse en una app de consola o en tests.

---

#### `src/services/authService.js`
Maneja todo el ciclo de autenticación:

- **`login(email, password)`** — verifica credenciales, genera tokens JWT
- **`logout(refreshToken)`** — agrega el refresh token a la blacklist
- **`refresh(refreshToken)`** — genera un nuevo access token sin pedir contraseña
- **`forgotPassword(email)`** — genera un token de recuperación
- **`resetPassword(token, newPassword)`** — valida el token y cambia la contraseña
- **`changePassword(userId, current, new)`** — cambia la contraseña conociendo la actual

---

#### `src/services/roleService.js`
Maneja la creación, edición y eliminación de roles. Aplica las restricciones de negocio:
- Los roles del sistema no se pueden renombrar ni borrar
- El Administrador debe conservar ciertos permisos
- No se puede borrar un rol que tenga usuarios asignados

---

#### `src/services/dashboardService.js`
Calcula las métricas del panel principal: total de ventas, clientes, productos, ingresos vs gastos, productos con stock bajo, facturas recientes.

---

### `src/controllers/`

**¿Para qué sirven los controllers?** Son el punto de contacto entre HTTP y el resto del sistema. Su responsabilidad es:
1. Leer datos del `req` (body, params, query)
2. Llamar al service correspondiente
3. Responder con `successResponse()` o dejar que el error lo maneje el middleware

Los controllers son intencionalmente delgados — toda la lógica está en los services.

---

#### `src/controllers/authController.js`
Expone los endpoints de autenticación. Por ejemplo el endpoint de login:

```js
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;           // 1. Lee del body
  const result = await authService.login(email, password); // 2. Llama al service
  res.cookie("refreshToken", result.refreshToken, ...);    // 3. Guarda cookie
  return successResponse(res, { data: { ... } });          // 4. Responde
});
```

---

### `src/middleware/`

Los middlewares son funciones que se ejecutan **antes** de que llegue la petición al controller. Express los encadena: si un middleware llama a `next()`, pasa al siguiente; si no, detiene la cadena.

---

#### `src/middleware/asyncHandler.js`
Wrapper que envuelve funciones async para capturar errores automáticamente. Sin esto, habría que poner `try/catch` en cada controller.

```js
// Sin asyncHandler — repetitivo:
async (req, res) => {
  try { await authService.login(...) }
  catch (err) { next(err) }
}

// Con asyncHandler — limpio:
asyncHandler(async (req, res) => {
  await authService.login(...)
})
```

---

#### `src/middleware/authMiddleware.js`
Protege las rutas privadas. Cuando una petición llega a una ruta protegida:
1. Extrae el token del header `Authorization: Bearer <token>`
2. Lo verifica con la clave secreta JWT
3. Busca el usuario en el JSON
4. Carga sus permisos
5. Agrega `req.user` para que los controllers sepan quién está haciendo la petición

Si el token es inválido o el usuario no existe, lanza un error 401.

---

#### `src/middleware/errorHandler.js`
Captura todos los errores del sistema y los devuelve como JSON con formato consistente:

```json
{
  "success": false,
  "code": "INVALID_CREDENTIALS",
  "message": "Credenciales inválidas"
}
```

Sin este middleware, Express devolvería HTML con el stack trace — inaceptable para una API.

---

### `src/routes/`

**¿Para qué sirven las rutas?** Mapean una URL + método HTTP a un controller específico.

```
POST /api/v1/auth/login  →  authController.login
GET  /api/v1/users       →  userController.list
```

#### `src/routes/index.js`
El router principal que agrupa todas las rutas bajo `/api/v1`. Importa cada módulo de rutas y los registra:

```js
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/income", incomeRoutes);
// etc.
```

Cada archivo de rutas (ej. `authRoutes.js`) define los endpoints de ese módulo y qué middlewares aplican. Las rutas protegidas usan `authenticate` antes del controller.

---

### `src/utils/`

Funciones de ayuda que se usan en múltiples partes del proyecto.

---

#### `src/utils/AppError.js`
Clase de error personalizada. Extiende la clase `Error` nativa de JavaScript y agrega:
- `statusCode` — el código HTTP (401, 403, 404, 500...)
- `code` — un código string legible por el frontend (`"INVALID_CREDENTIALS"`)
- `isOperational` — marca que es un error esperado, no un bug

El middleware `errorHandler` detecta estos errores y los formatea correctamente.

---

#### `src/utils/jwt.js`
Funciones para crear y verificar tokens JWT. Hay 3 tipos de tokens:

| Token | Duración | Para qué |
|-------|----------|----------|
| **Access token** | 1 hora | Autoriza las peticiones a la API |
| **Refresh token** | 7 días | Obtiene un nuevo access token sin re-loguearse |
| **Reset token** | 15 minutos | Recuperar contraseña olvidada |

Cada token incluye el campo `type` para que no se pueda usar un refresh token como access token.

---

#### `src/utils/apiResponse.js`
Función `successResponse()` que estandariza todas las respuestas exitosas:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

Todas las respuestas de la API tienen el mismo formato, lo que facilita el manejo en el frontend.

---

#### `src/utils/password.js`
Funciones para el manejo seguro de contraseñas usando `bcrypt`:
- `hashPassword(plain)` — convierte `"Admin123!"` en un hash irreversible
- `comparePassword(plain, hash)` — verifica si una contraseña corresponde a un hash
- `validatePasswordStrength(password)` — valida que la contraseña sea suficientemente fuerte

**¿Por qué bcrypt?** Es el estándar de la industria para contraseñas. Aplica un "salt" (valor aleatorio) que hace que el mismo password genere un hash diferente cada vez. Es computacionalmente caro a propósito, lo que hace los ataques de fuerza bruta muy lentos.

---

## 6. FRONTEND — CARPETA POR CARPETA

### `frontend/index.html`
El único archivo HTML del proyecto. Solo tiene un `<div id="root">` — React inyecta toda la interfaz dentro de ese div.

### `frontend/src/main.tsx`
Punto de entrada de React. Renderiza el componente `<App>` dentro del `#root`. También registra el `QueryClientProvider` de React Query.

### `frontend/src/App.tsx`
Define toda la estructura de navegación usando **React Router**. Cada `<Route>` mapea una URL a un componente de página:

```tsx
<Route path="/income" element={<IncomeListPage />} />
```

Las rutas privadas están envueltas en `<ProtectedRoute>`, que verifica si hay sesión activa y si el usuario tiene el permiso requerido.

---

### `frontend/src/pages/`

Cada archivo es una **pantalla completa** de la aplicación. Las páginas orquestan componentes, llaman a los services y manejan el estado local.

| Página | Ruta | Permiso requerido |
|--------|------|-------------------|
| `LoginPage` | `/login` | Ninguno |
| `Dashboard` | `/` | Autenticado |
| `UserListPage` | `/users` | `users:manage` |
| `IncomeListPage` | `/income` | `income:read` |
| `ExpenseListPage` | `/expenses` | `expenses:read` |
| `ProductListPage` | `/products` | `products:read` |
| `InvoiceListPage` | `/invoicing` | `invoices:read` |
| `ReportsPage` | `/reports` | `reports:read` |
| `AIPage` | `/ai` | `ai:use` |

---

### `frontend/src/components/`

Componentes reutilizables que no son páginas completas.

#### `components/layout/`
- **`MainLayout.tsx`** — el contenedor principal con sidebar + header + área de contenido
- **`Sidebar.tsx`** — menú de navegación lateral con los ítems filtrados por permiso
- **`Header.tsx`** — barra superior con nombre del usuario y botón de logout

#### `components/ui/`
Componentes de interfaz básicos, reutilizables en cualquier parte:
- **`Button.tsx`** — botón con variantes (primary, secondary, danger) y estado de carga
- **`Input.tsx`** — campo de texto con label y manejo de errores integrado
- **`Select.tsx`** — selector desplegable
- **`Badge.tsx`** — etiqueta de estado (activo, inactivo, etc.)

---

### `frontend/src/services/`

**¿Para qué sirven?** Son los únicos archivos que hacen llamadas HTTP al backend. Si la URL de la API cambia, solo cambias estos archivos.

#### `services/api.ts`
Configura una instancia de **axios** con comportamiento base:
- URL base: `/api/v1` (usa el proxy de Vite durante desarrollo)
- Timeout de 15 segundos
- Interceptor de request: agrega automáticamente `Authorization: Bearer <token>` a todas las peticiones
- Interceptor de response: si llega un 401, limpia la sesión y redirige al login

#### `services/authService.ts`
Llama a `/auth/login` y `/auth/logout`. Después del login exitoso, guarda el token y el usuario en `localStorage` usando el `authStore`.

#### `services/incomeService.ts`, `expenseService.ts`, etc.
Cada módulo tiene su propio service que hace CRUD (crear, leer, actualizar, borrar) contra el endpoint correspondiente.

---

### `frontend/src/stores/`

#### `stores/authStore.ts`
Maneja el estado de la sesión del usuario en `localStorage`. No usa una librería externa — es un objeto plano con métodos.

| Método | Qué hace |
|--------|----------|
| `setSession(token, user)` | Guarda token y usuario al hacer login |
| `clear()` | Elimina token y usuario al hacer logout |
| `getToken()` | Devuelve el JWT actual |
| `getUser()` | Devuelve los datos del usuario actual |
| `isAuthenticated()` | Devuelve `true` si hay un token guardado |
| `hasPermission(perm)` | Verifica si el usuario tiene un permiso específico |
| `getPermissions()` | Lista todos los permisos del usuario |

---

### `frontend/src/routes/`

#### `routes/ProtectedRoute.tsx`
Componente que protege las rutas privadas. Antes de renderizar la página:
1. Verifica si el usuario está autenticado. Si no, redirige a `/login`
2. Si se especificó un permiso requerido, verifica que el usuario lo tenga. Si no, redirige a `/unauthorized`
3. Si todo está bien, renderiza la página (`<Outlet />`)

---

### `frontend/src/types/`

Archivos TypeScript que definen la "forma" de los datos. No tienen lógica, solo describen estructuras.

- **`auth.ts`** — tipos para login, respuesta de auth, usuario autenticado
- **`user.ts`** — tipo de usuario completo
- **`erp.ts`** — tipos para Income, Expense, Product, Client, Invoice
- **`api.ts`** — tipo genérico `APIResponse<T>` que describe el envelope de respuestas

Ejemplo:
```ts
// El backend siempre responde con esta estructura
interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

---

### `frontend/src/utils/constants.ts`
Constantes globales del frontend:
- `APP_NAME` — nombre de la aplicación desde el `.env`
- `API_BASE_URL` — URL base de la API (default: `/api/v1`)
- `PERMISSIONS` — los mismos permisos que el backend, duplicados aquí para usar en el frontend
- `NAV_ITEMS` — los ítems del menú de navegación con su ruta y permiso requerido

---

### `frontend/vite.config.ts`
Configuración del servidor de desarrollo Vite.

**El proxy es la parte más importante:**
```ts
proxy: {
  "/api": {
    target: "http://localhost:3000",
    changeOrigin: true,
  },
}
```

Esto hace que cuando el frontend (en `:5173`) llama a `/api/v1/auth/login`, Vite reenvía esa petición al backend en `http://localhost:3000/api/v1/auth/login`. Sin esto, el navegador bloquearía la petición por CORS (dominios distintos).

---

## 7. BASE DE DATOS JSON

### ¿Cómo funciona?

Cada colección de datos es un archivo `.json` en la carpeta `/data`. El archivo es un **array de objetos**, como una tabla de base de datos.

```json
// data/users.json
[
  {
    "id": "723fcf94-...",
    "email": "admin@contaia.com",
    "passwordHash": "$2b$12$...",
    "role": "Administrador",
    ...
  }
]
```

### Archivos y su contenido

| Archivo | Qué guarda |
|---------|------------|
| `users.json` | Todos los usuarios del sistema |
| `roles.json` | Roles y sus permisos |
| `incomes.json` | Registros de ingresos |
| `expenses.json` | Registros de egresos/gastos |
| `clients.json` | Clientes de la empresa |
| `products.json` | Productos e inventario |
| `invoices.json` | Facturas generadas |
| `inventory.json` | Movimientos de inventario |
| `token-blacklist.json` | Tokens JWT revocados (logout) |

### Limitaciones del JSON
- No escala a millones de registros (todo el archivo se carga en memoria)
- No hay transacciones (si falla a mitad de escritura, puede corromper el archivo)
- No hay búsqueda indexada (para buscar hay que recorrer todo el array)

Para producción real se usaría MySQL, PostgreSQL o MongoDB. Para aprendizaje y prototipos, JSON es perfecto.

---

## 8. PAQUETES DEL BACKEND EXPLICADOS

### Dependencias de producción

| Paquete | Para qué se usa |
|---------|-----------------|
| **express** `4.x` | El servidor web. Maneja rutas, middlewares y respuestas HTTP |
| **bcrypt** `5.x` | Hashear contraseñas. Usa un algoritmo criptográfico fuerte y lento por diseño |
| **jsonwebtoken** `9.x` | Crear y verificar tokens JWT para la autenticación |
| **dotenv** `16.x` | Cargar el archivo `.env` como variables de entorno en `process.env` |
| **cors** `2.x` | Middleware que controla qué dominios pueden hacer peticiones a la API |
| **helmet** `8.x` | Agrega headers HTTP de seguridad (previene XSS, clickjacking, etc.) |
| **morgan** `1.x` | Logger HTTP: muestra en consola cada petición con su método, ruta y status |
| **cookie-parser** `1.x` | Permite leer las cookies de las peticiones (para el refresh token) |
| **express-validator** `7.x` | Valida y sanitiza datos del body de las peticiones |
| **multer** `1.x` | Manejo de subida de archivos (imágenes de productos, etc.) |
| **exceljs** `4.x` | Genera archivos Excel para los reportes exportables |
| **pdfkit** `0.x` | Genera archivos PDF para reportes e impresión de facturas |
| **chart.js** `4.x` | Librería de gráficas (usada desde el frontend vía CDN o imports) |
| **mysql2** `3.x` | Driver de MySQL (instalado pero no usado actualmente — se usa JSON) |

### Dependencias de desarrollo

| Paquete | Para qué se usa |
|---------|-----------------|
| **nodemon** `3.x` | Reinicia el servidor automáticamente cuando guardas un archivo |
| **concurrently** `10.x` | Ejecuta múltiples comandos al mismo tiempo (backend + frontend) |

---

## 9. PAQUETES DEL FRONTEND EXPLICADOS

### Dependencias de producción

| Paquete | Para qué se usa |
|---------|-----------------|
| **react** `18.x` | La librería principal de UI. Maneja componentes y el Virtual DOM |
| **react-dom** `18.x` | Conecta React con el DOM real del navegador |
| **react-router-dom** `7.x` | Navegación entre páginas sin recargar. Maneja las rutas de la SPA |
| **axios** `1.x` | Cliente HTTP. Hace las peticiones al backend con interceptores configurables |
| **@tanstack/react-query** `5.x` | Manejo de estado del servidor: cache de datos, loading, errores automáticos |
| **lucide-react** `0.x` | Librería de íconos SVG como componentes React |

### Dependencias de desarrollo

| Paquete | Para qué se usa |
|---------|-----------------|
| **vite** `6.x` | El bundler/servidor de desarrollo. Mucho más rápido que Webpack |
| **typescript** `5.x` | El compilador de TypeScript que convierte `.ts` a `.js` |
| **@vitejs/plugin-react** | Plugin para que Vite entienda JSX y React |
| **tailwindcss** `3.x` | Framework CSS utilitario. En vez de escribir CSS, usas clases como `flex`, `p-4`, `text-red-500` |
| **postcss** `8.x` | Procesador de CSS requerido por Tailwind |
| **autoprefixer** | Agrega prefijos de navegador automáticamente al CSS generado |
| **@types/react** | Tipos TypeScript para React (permite autocompletado e intellisense) |
| **@types/react-dom** | Tipos TypeScript para ReactDOM |

---

## 10. FLUJO COMPLETO DE UNA PETICIÓN

### Ejemplo: El usuario hace login desde el navegador

```
1. NAVEGADOR
   El usuario escribe admin@contaia.com y Admin123! y hace clic en "Iniciar sesión"

2. FRONTEND — LoginPage.tsx
   Llama a login({ email, password }) del authService

3. FRONTEND — authService.ts
   Hace POST /api/v1/auth/login con axios

4. VITE PROXY (solo en desarrollo)
   Redirige /api/v1/auth/login → http://localhost:3000/api/v1/auth/login

5. BACKEND — Express (app.js)
   Recibe la petición. Pasa por middlewares: helmet, cors, json parser, morgan

6. BACKEND — routes/authRoutes.js
   Reconoce POST /auth/login, apunta al controller

7. BACKEND — authController.js → login()
   Lee email y password del req.body
   Llama a authService.login(email, password)

8. BACKEND — authService.js → login()
   Busca el usuario por email en userRepository
   Verifica la contraseña con bcrypt.compare()
   Carga los permisos desde roleRepository
   Genera accessToken (JWT, dura 1h) y refreshToken (JWT, dura 7d)

9. BACKEND — authController.js (continúa)
   Guarda el refreshToken en una cookie httpOnly
   Responde con 200 OK + { user, accessToken }

10. FRONTEND — authService.ts (continúa)
    Recibe la respuesta
    Llama a authStore.setSession(token, user)
    Guarda token y datos del usuario en localStorage

11. FRONTEND — LoginPage.tsx (continúa)
    navigate("/") redirige al Dashboard

12. FRONTEND — ProtectedRoute.tsx
    Verifica que hay token en localStorage → permite el acceso

13. FRONTEND — Dashboard.tsx
    Carga los datos del dashboard haciendo GET /api/v1/dashboard
    Con el token en el header: Authorization: Bearer eyJhbG...
```

---

## 11. SISTEMA DE AUTENTICACIÓN Y JWT

### ¿Qué es JWT?
JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre partes. Un token tiene 3 partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9   ← Header (algoritmo usado)
.eyJzdWIiOiI3MjNm...    ← Payload (datos: userId, role, permissions)
.4aBADdjcsBBT3FLe...    ← Firma (verifica que nadie alteró el token)
```

El servidor firma el token con una clave secreta (`JWT_SECRET`). Si alguien altera el payload, la firma deja de coincidir y el token es rechazado.

### ¿Por qué dos tokens?

**Access Token (1 hora):**
- Se envía en cada petición en el header `Authorization: Bearer <token>`
- Duración corta por seguridad: si alguien lo roba, solo lo puede usar 1 hora

**Refresh Token (7 días):**
- Se guarda en una cookie `httpOnly` (JavaScript del frontend no puede leerla, más seguro)
- Cuando el access token expira, el frontend llama a `/auth/refresh` con la cookie y obtiene un nuevo access token sin re-loguearse
- Al hacer logout, el refresh token se agrega a la blacklist en `token-blacklist.json`

### Flujo completo de tokens

```
Login → AccessToken (1h) + RefreshToken en cookie (7d)
         ↓
Cada petición → Authorization: Bearer <AccessToken>
         ↓
AccessToken expira → POST /auth/refresh → Nuevo AccessToken
         ↓
Logout → RefreshToken agregado a blacklist → Usuario desconectado
```

---

## 12. SISTEMA DE ROLES Y PERMISOS

### Los 4 roles

```
Administrador → TODOS los permisos (20/20)
Contador      → Finanzas y clientes (17/20) — sin users:manage, roles:manage
Gerente       → Solo lectura + reportes (11/20) — sin write en la mayoría
Empleado      → Operaciones básicas (10/20) — sin reportes ni gestión
```

### ¿Cómo funciona el control de acceso?

**En el backend** — cada ruta protegida verifica permisos:
```js
// Solo pasa si el usuario tiene el permiso income:write
router.post("/", authenticate, requirePermission("income:write"), incomeController.create);
```

**En el frontend** — cada ruta verifica antes de renderizar:
```tsx
// Si no tiene income:read, redirige a /unauthorized
<ProtectedRoute permission="income:read">
  <IncomeListPage />
</ProtectedRoute>
```

**En el sidebar** — los ítems de navegación solo aparecen si el usuario tiene el permiso:
```tsx
// El ítem "Usuarios" solo se muestra si hasPermission("users:manage")
NAV_ITEMS.filter(item => !item.permission || hasPermission(item.permission))
```

---

## 13. CÓMO CORRER EL PROYECTO

### Requisitos previos
- Node.js 18 o superior
- npm 8 o superior

### Instalación

```bash
# 1. Instalar dependencias del backend (en la raíz)
npm install

# 2. Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### Correr en desarrollo

```bash
# Desde la raíz — levanta backend (:3000) y frontend (:5173) juntos
npm run dev
```

Abrir el navegador en: **http://localhost:5173**

### Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@contaia.com | Admin123! | Administrador |
| contador@contaia.com | Contador123! | Contador |
| empleado@contaia.com | Empleado123! | Empleado |
| gerente@contaia.com | Gerente123! | Gerente |

### Estructura de la API

Todos los endpoints están bajo `/api/v1/`:

| Módulo | Endpoints |
|--------|-----------|
| Salud | `GET /health` |
| Auth | `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me` |
| Roles | `GET /roles`, `POST /roles`, `PUT /roles/:id`, `DELETE /roles/:id` |
| Usuarios | `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` |
| Ingresos | `GET /income`, `POST /income`, `PUT /income/:id`, `DELETE /income/:id` |
| Gastos | `GET /expenses`, `POST /expenses`, `PUT /expenses/:id`, `DELETE /expenses/:id` |
| Clientes | `GET /clients`, `POST /clients`, `PUT /clients/:id`, `DELETE /clients/:id` |
| Productos | `GET /products`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id` |
| Facturas | `GET /invoices`, `POST /invoices`, `PUT /invoices/:id` |
| Inventario | `GET /inventory`, `POST /inventory` |
| Dashboard | `GET /dashboard` |
| Reportes | `GET /reports` |
| IA | `POST /ai/analyze` |
