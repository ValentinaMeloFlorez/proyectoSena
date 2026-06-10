# CONTAIA PRO — Proyecto Base Express (MVC)

## Instalación

```bash
# Desde la raíz del proyecto
npm install

# Configurar variables de entorno
copy .env.example .env

# Desarrollo (recarga automática con --watch)
npm run dev

# Producción
npm start
```

## Instalación de dependencias

```bash
npm init -y

npm install express cors dotenv bcrypt jsonwebtoken express-validator multer helmet morgan cookie-parser pdfkit exceljs chart.js

npm install nodemon --save-dev
```

O en un solo paso (recomendado, `package.json` ya configurado):

```bash
npm install
```

## Dependencias

| Paquete | Función |
|---------|---------|
| **express** | Framework web HTTP. Rutas, middleware y respuestas. Núcleo del servidor. |
| **cors** | Permite peticiones cross-origin desde el frontend (otro puerto/dominio). |
| **dotenv** | Carga variables de entorno desde `.env`. |
| **bcrypt** | Hash seguro de contraseñas (módulo Autenticación). |
| **jsonwebtoken** | Creación y verificación de tokens JWT (sesiones). |
| **express-validator** | Validación y sanitización de datos de entrada en rutas. |
| **multer** | Manejo de archivos multipart/form-data (uploads). |
| **helmet** | Headers HTTP de seguridad (XSS, clickjacking, etc.). |
| **morgan** | Logger de requests HTTP en consola. |
| **cookie-parser** | Parseo de cookies en requests (tokens en cookie opcional). |
| **pdfkit** | Generación de documentos PDF (facturas, reportes). |
| **exceljs** | Generación y lectura de archivos Excel (exportar reportes). |
| **chart.js** | Gráficos para reportes y dashboard (uso en backend o compartido). |
| **nodemon** *(dev)* | Reinicio automático del servidor en desarrollo. |

## Estructura de Carpetas

```
contaia-pro/
├── server.js              # Entrada: levanta el servidor HTTP
├── app.js                 # Configuración Express (middleware + rutas)
├── package.json           # Dependencias y scripts npm
├── .env.example           # Plantilla de variables de entorno
│
└── src/
    ├── config/            # Configuración centralizada
    ├── controllers/       # Capa C — Manejo de requests HTTP
    ├── services/          # Lógica de negocio
    ├── models/            # Capa M — Entidades de datos
    ├── routes/            # Definición de rutas por módulo
    ├── middleware/        # Cross-cutting (errores, auth futuro)
    └── utils/             # Helpers (AppError, apiResponse)
```

## Arquitectura MVC

```
Request HTTP
    ↓
Routes          →  Define URL y método
    ↓
Controller      →  Recibe req/res, delega al Service
    ↓
Service         →  Lógica de negocio
    ↓
Model           →  Estructura de datos (futuro: BD)
    ↓
apiResponse     →  JSON al cliente (Vista)
```

## URLs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Info de la aplicación |
| `/api/v1/health` | GET | Health check |
