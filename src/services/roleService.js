/**
 * Service — Lógica de negocio del módulo de roles
 */

import { Role } from "../models/Role.js";
import { roleRepository } from "../repositories/roleRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { PERMISSION_CATALOG, ALL_PERMISSION_CODES, isValidPermission } from "../config/permissions.js";
import { ROLE_RESTRICTIONS, ROLE_ERRORS } from "../config/restrictions.js";
import { ROLES } from "../config/roles.js";
import { AppError } from "../utils/AppError.js";

export class RoleService {
  _validatePermissions(permissions) {
    if (!Array.isArray(permissions) || permissions.length === 0) {
      throw new AppError("Debe asignar al menos un permiso", 422, "NO_PERMISSIONS");
    }

    const invalid = permissions.filter((p) => !isValidPermission(p));
    if (invalid.length > 0) {
      throw new AppError(ROLE_ERRORS.INVALID_PERMISSIONS, 422, "INVALID_PERMISSIONS", invalid);
    }

    const max = ROLE_RESTRICTIONS.MAX_PERMISSIONS_PER_CUSTOM_ROLE;
    if (max > 0 && permissions.length > max) {
      throw new AppError(`Máximo ${max} permisos por rol`, 422, "TOO_MANY_PERMISSIONS");
    }

    return [...new Set(permissions)];
  }

  _enforceAdminPermissions(roleName, permissions) {
    if (roleName !== ROLES.ADMINISTRADOR || !ROLE_RESTRICTIONS.ADMIN_MUST_KEEP_ROLES_MANAGE) {
      return permissions;
    }

    const required = ROLE_RESTRICTIONS.ADMIN_REQUIRED_PERMISSIONS;
    const missing = required.filter((p) => !permissions.includes(p));
    if (missing.length > 0) {
      throw new AppError(ROLE_ERRORS.ADMIN_PERMISSIONS, 422, "ADMIN_PERMISSIONS", missing);
    }
    return permissions;
  }

  async listRoles(companyId) {
    return roleRepository.findAll(companyId);
  }

  async getRoleById(id, companyId) {
    const role = await roleRepository.findById(id, companyId);
    if (!role) throw new AppError(ROLE_ERRORS.NOT_FOUND, 404, "ROLE_NOT_FOUND");
    return role;
  }

  async listPermissions() {
    return PERMISSION_CATALOG;
  }

  async createRole(data, companyId, createdBy) {
    const existing = await roleRepository.findByNameIncludingInactive(data.name, companyId);
    if (existing) {
      throw new AppError(ROLE_ERRORS.DUPLICATE_NAME, 409, "DUPLICATE_ROLE");
    }

    const permissions = this._enforceAdminPermissions(data.name, this._validatePermissions(data.permissions));

    const role = new Role({
      id: crypto.randomUUID(),
      name: data.name.trim(),
      description: data.description?.trim() || "",
      permissions,
      isSystem: false,
      companyId,
      createdBy,
    });

    return roleRepository.create(role);
  }

  async updateRole(id, data, companyId, updatedBy) {
    const role = await this.getRoleById(id, companyId);

    if (ROLE_RESTRICTIONS.SYSTEM_ROLES_CANNOT_RENAME && role.isSystem && data.name && data.name !== role.name) {
      throw new AppError(ROLE_ERRORS.SYSTEM_ROLE_RENAME, 403, "SYSTEM_ROLE_RENAME");
    }

    if (data.name) {
      const duplicate = await roleRepository.findByNameIncludingInactive(data.name, companyId);
      if (duplicate && duplicate.id !== role.id) {
        throw new AppError(ROLE_ERRORS.DUPLICATE_NAME, 409, "DUPLICATE_ROLE");
      }
      if (!role.isSystem) role.name = data.name.trim();
    }

    if (data.description !== undefined) role.description = data.description.trim();

    if (data.permissions) {
      const permissions = this._enforceAdminPermissions(role.name, this._validatePermissions(data.permissions));
      role.permissions = permissions;
    }

    role.updatedBy = updatedBy;
    return roleRepository.update(role);
  }

  async deleteRole(id, companyId) {
    const role = await this.getRoleById(id, companyId);

    if (ROLE_RESTRICTIONS.SYSTEM_ROLES_CANNOT_DELETE && role.isSystem) {
      throw new AppError(ROLE_ERRORS.SYSTEM_ROLE_DELETE, 403, "SYSTEM_ROLE_DELETE");
    }

    if (ROLE_RESTRICTIONS.PROTECTED_ROLE_NAMES.includes(role.name)) {
      throw new AppError(ROLE_ERRORS.SYSTEM_ROLE_DELETE, 403, "PROTECTED_ROLE");
    }

    const usersCount = await userRepository.countByRole(role.name, companyId);
    if (usersCount > 0) {
      throw new AppError(ROLE_ERRORS.ROLE_IN_USE, 409, "ROLE_IN_USE", { usersCount });
    }

    return roleRepository.softDelete(id, companyId);
  }

  async resolveUserPermissions(roleName, roleId, companyId) {
    if (roleId) {
      const perms = await roleRepository.getPermissionsForRoleId(roleId, companyId);
      if (perms.length > 0) return perms;
    }
    return roleRepository.getPermissionsForRoleName(roleName, companyId);
  }
}

export const roleService = new RoleService();
