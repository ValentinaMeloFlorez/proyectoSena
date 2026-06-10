# Módulo 3 — Roles y Permisos

## Endpoints

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/api/v1/roles` | `roles:manage` | Listar roles |
| GET | `/api/v1/roles/permissions` | `roles:manage` | Catálogo de permisos |
| GET | `/api/v1/roles/:id` | `roles:manage` | Detalle de rol |
| POST | `/api/v1/roles` | `roles:manage` | Crear rol personalizado |
| PUT | `/api/v1/roles/:id` | `roles:manage` | Actualizar rol |
| DELETE | `/api/v1/roles/:id` | `roles:manage` | Eliminar rol |

## Restricciones

| Regla | Descripción |
|-------|-------------|
| Roles del sistema | No se pueden eliminar ni renombrar |
| Rol Administrador | Siempre conserva `roles:manage` y `users:manage` |
| Rol en uso | No se elimina si tiene usuarios asignados |
| Nombre duplicado | No permitido en la misma empresa |
| Permisos inválidos | Solo del catálogo oficial |
| Auto-modificación | Admin no puede quitarse sus permisos de administración |

## Middleware — guard

```javascript
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";

router.get("/roles", ...guard.rolesManage, handler);
router.get("/clientes", ...guard.permission(PERMISSIONS.CLIENTS_READ), handler);
router.get("/finanzas", ...guard.anyPermission(PERMISSIONS.INCOME_READ, PERMISSIONS.EXPENSES_READ), handler);
router.delete("/admin", ...guard.admin, handler);
```

## Roles del sistema

- Administrador
- Contador
- Empleado
- Gerente
