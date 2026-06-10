/**
 * Middleware de autorización — roles, permisos y restricciones
 */

import { AppError } from "../utils/AppError.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401, "UNAUTHORIZED"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Acceso denegado. Roles permitidos: ${allowedRoles.join(", ")}`,
          403,
          "FORBIDDEN"
        )
      );
    }
    next();
  };
};

export const denyRoles = (...deniedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401, "UNAUTHORIZED"));
    }
    if (deniedRoles.includes(req.user.role)) {
      return next(new AppError("Tu rol no tiene acceso a este recurso", 403, "FORBIDDEN"));
    }
    next();
  };
};

export const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401, "UNAUTHORIZED"));
    }
    if (!req.user.permissions.includes(permission)) {
      return next(new AppError(`Permiso requerido: ${permission}`, 403, "FORBIDDEN"));
    }
    next();
  };
};

export const authorizeAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401, "UNAUTHORIZED"));
    }
    const hasAny = permissions.some((p) => req.user.permissions.includes(p));
    if (!hasAny) {
      return next(
        new AppError(
          `Se requiere al menos uno de: ${permissions.join(", ")}`,
          403,
          "FORBIDDEN"
        )
      );
    }
    next();
  };
};

export const authorizeAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401, "UNAUTHORIZED"));
    }
    const missing = permissions.filter((p) => !req.user.permissions.includes(p));
    if (missing.length > 0) {
      return next(new AppError(`Permisos requeridos: ${missing.join(", ")}`, 403, "FORBIDDEN"));
    }
    next();
  };
};

/**
 * Restricción: impide modificar el propio rol de administrador
 */
export const restrictSelfRoleChange = (req, res, next) => {
  const roleId = req.params.id;
  if (req.user.roleId === roleId && req.user.role === "Administrador") {
    const removingAdmin = req.body.permissions &&
      !req.body.permissions.includes("roles:manage");
    if (removingAdmin) {
      return next(
        new AppError("No puedes eliminar tus propios permisos de administración", 403, "SELF_RESTRICTION")
      );
    }
  }
  next();
};
