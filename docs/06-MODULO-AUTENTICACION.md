# Módulo 2 — Autenticación

## Usuarios de prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@contaia.com | Admin123! | Administrador |
| contador@contaia.com | Contador123! | Contador |
| empleado@contaia.com | Empleado123! | Empleado |
| gerente@contaia.com | Gerente123! | Gerente |

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/auth/login` | No | Iniciar sesión |
| POST | `/api/v1/auth/logout` | Sí | Cerrar sesión |
| POST | `/api/v1/auth/refresh` | Cookie | Renovar access token |
| GET | `/api/v1/auth/me` | Sí | Perfil del usuario |
| POST | `/api/v1/auth/forgot-password` | No | Solicitar reset |
| POST | `/api/v1/auth/reset-password` | No | Restablecer contraseña |
| POST | `/api/v1/auth/change-password` | Sí | Cambiar contraseña |

## Flujo de Login

```
Cliente → POST /auth/login { email, password }
    → Validator (express-validator)
    → AuthService.login()
        → Buscar usuario por email
        → bcrypt.compare(password)
        → Generar accessToken (JWT 1h)
        → Generar refreshToken (JWT 7d, httpOnly cookie)
    → Response { user, accessToken }
```

## Flujo de Logout

```
Cliente → POST /auth/logout (Bearer accessToken)
    → AuthService.logout(refreshToken from cookie)
        → Agregar refreshToken a blacklist
    → clearCookie(refreshToken)
```

## Flujo de Recuperación

```
1. POST /auth/forgot-password { email }
   → Genera resetToken JWT (15 min)
   → En dev: retorna token en response
   → En prod: enviar por email (integrar en módulo futuro)

2. POST /auth/reset-password { token, newPassword }
   → Valida fortaleza de contraseña
   → Verifica resetToken
   → Actualiza hash bcrypt
```

## Seguridad

- Contraseñas con **bcrypt** (12 salt rounds)
- **JWT** firmado con secretos separados (access / refresh)
- Refresh token en **cookie httpOnly** (no accesible desde JS)
- **Blacklist** de refresh tokens al logout
- Respuesta genérica en forgot-password (no revela si email existe)
- **Helmet** + **CORS** restrictivo
- Validación de fortaleza de contraseña en reset/change

## Roles y permisos

| Rol | Acceso |
|-----|--------|
| Administrador | Todos los permisos |
| Contador | Finanzas, facturación, reportes |
| Empleado | Clientes, facturación básica |
| Gerente | Lectura ejecutiva + reportes |

## Middleware

```javascript
import { authenticate } from "./middleware/authMiddleware.js";
import { authorize, authorizePermission } from "./middleware/authorizeMiddleware.js";
import { ROLES, PERMISSIONS } from "./config/roles.js";

router.get("/admin", authenticate, authorize(ROLES.ADMINISTRADOR), handler);
router.get("/reports", authenticate, authorizePermission(PERMISSIONS.REPORTS_READ), handler);
```
