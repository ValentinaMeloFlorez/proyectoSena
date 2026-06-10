/**
 * Middleware de protección de rutas — RBAC centralizado
 */

import { findRoutePermission } from "../config/routePermissions.js";
import { PERMISSIONS } from "../config/permissions.js";
import { AppError } from "../utils/AppError.js";
import { authenticate } from "./authMiddleware.js";
import {
  authorize,
  authorizePermission,
  authorizeAnyPermission,
  authorizeAllPermissions,
  denyRoles,
} from "./authorizeMiddleware.js";
import { ROLES } from "../config/roles.js";

/**
 * Protección declarativa — combina auth + permiso en un solo array de middlewares
 *
 * @example
 * router.get("/roles", ...guard.permission(PERMISSIONS.ROLES_MANAGE), handler);
 */
export const guard = {
  /** Solo requiere autenticación */
  auth: [authenticate],

  /** Requiere uno de los roles indicados */
  role: (...roles) => [authenticate, authorize(...roles)],

  /** Requiere un permiso específico */
  permission: (permission) => [authenticate, authorizePermission(permission)],

  /** Requiere al menos uno de los permisos */
  anyPermission: (...permissions) => [authenticate, authorizeAnyPermission(...permissions)],

  /** Requiere todos los permisos */
  allPermissions: (...permissions) => [authenticate, authorizeAllPermissions(...permissions)],

  /** Solo administrador */
  admin: [authenticate, authorize(ROLES.ADMINISTRADOR)],

  /** Gestión de roles */
  rolesManage: [authenticate, authorizePermission(PERMISSIONS.ROLES_MANAGE)],

  /** Bloquea roles específicos */
  notRole: (...roles) => [authenticate, denyRoles(...roles)],
};

/**
 * Middleware automático — aplica permiso según ROUTE_PERMISSION_MAP
 * Montar en app.js o router principal DESPUÉS de authenticate global si se usa
 */
export const autoRouteGuard = (req, res, next) => {
  if (!req.user) return next();

  const required = findRoutePermission(req.method, req.originalUrl);
  if (!required) return next();

  if (!req.user.permissions.includes(required)) {
    return next(new AppError(`Permiso requerido: ${required}`, 403, "FORBIDDEN"));
  }

  next();
};

export { authenticate, authorize, authorizePermission };
