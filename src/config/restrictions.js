/**
 * Restricciones de negocio del módulo de roles
 */

import { ROLES } from "./roles.js";
import { PERMISSIONS } from "./permissions.js";

export const ROLE_RESTRICTIONS = {
  /** Roles del sistema no pueden eliminarse */
  SYSTEM_ROLES_CANNOT_DELETE: true,

  /** Roles del sistema no pueden renombrarse */
  SYSTEM_ROLES_CANNOT_RENAME: true,

  /** El rol Administrador siempre conserva roles:manage */
  ADMIN_MUST_KEEP_ROLES_MANAGE: true,

  /** Permisos mínimos obligatorios del Administrador */
  ADMIN_REQUIRED_PERMISSIONS: [PERMISSIONS.ROLES_MANAGE, PERMISSIONS.USERS_MANAGE],

  /** Rol protegido contra eliminación */
  PROTECTED_ROLE_NAMES: [ROLES.ADMINISTRADOR],

  /** Máximo de permisos asignables a un rol personalizado (0 = sin límite) */
  MAX_PERMISSIONS_PER_CUSTOM_ROLE: 0,
};

export const ROLE_ERRORS = {
  SYSTEM_ROLE_DELETE: "No se puede eliminar un rol del sistema",
  SYSTEM_ROLE_RENAME: "No se puede renombrar un rol del sistema",
  ROLE_IN_USE: "El rol tiene usuarios asignados y no puede eliminarse",
  DUPLICATE_NAME: "Ya existe un rol con ese nombre",
  INVALID_PERMISSIONS: "Uno o más permisos no son válidos",
  ADMIN_PERMISSIONS: "El rol Administrador debe conservar permisos de administración",
  NOT_FOUND: "Rol no encontrado",
  FORBIDDEN_ROLE: "No tienes permiso para gestionar roles",
};
