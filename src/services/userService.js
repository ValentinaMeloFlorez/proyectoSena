/**
 * Service — CRUD de usuarios
 */

import { User } from "../models/User.js";
import { userRepository } from "../repositories/userRepository.js";
import { roleRepository } from "../repositories/roleRepository.js";
import { ROLES } from "../config/roles.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword, validatePasswordStrength } from "../utils/password.js";

export class UserService {
  async _resolveRole(roleId, companyId) {
    const role = await roleRepository.findById(roleId, companyId);
    if (!role) throw new AppError("Rol no encontrado", 404, "ROLE_NOT_FOUND");
    return role;
  }

  async list(companyId, query = {}) {
    return userRepository.list(companyId, query);
  }

  async getById(id, companyId) {
    const user = await userRepository.findById(id);
    if (!user || user.companyId !== companyId) {
      throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }
    return user;
  }

  async create(data, companyId, createdBy) {
    const existingEmail = await userRepository.findByEmail(data.email, false);
    if (existingEmail) {
      throw new AppError("El correo ya está registrado", 409, "DUPLICATE_EMAIL");
    }

    const existingDoc = await userRepository.findByDocument(data.document, companyId);
    if (existingDoc) {
      throw new AppError("El documento ya está registrado", 409, "DUPLICATE_DOCUMENT");
    }

    const strengthErrors = validatePasswordStrength(data.password);
    if (strengthErrors.length > 0) {
      throw new AppError("Contraseña débil", 422, "WEAK_PASSWORD", strengthErrors);
    }

    const role = await this._resolveRole(data.roleId, companyId);

    const user = new User({
      id: crypto.randomUUID(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      document: data.document.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: await hashPassword(data.password),
      role: role.name,
      roleId: role.id,
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return userRepository.create(user);
  }

  async update(id, data, companyId, updatedBy, currentUserId) {
    const user = await this.getById(id, companyId);

    if (data.email && data.email.toLowerCase() !== user.email) {
      const existing = await userRepository.findByEmail(data.email, false);
      if (existing && existing.id !== user.id) {
        throw new AppError("El correo ya está registrado", 409, "DUPLICATE_EMAIL");
      }
      user.email = data.email.trim().toLowerCase();
    }

    if (data.document && data.document !== user.document) {
      const existingDoc = await userRepository.findByDocument(data.document, companyId, user.id);
      if (existingDoc) {
        throw new AppError("El documento ya está registrado", 409, "DUPLICATE_DOCUMENT");
      }
      user.document = data.document.trim();
    }

    if (data.firstName) user.firstName = data.firstName.trim();
    if (data.lastName) user.lastName = data.lastName.trim();

    if (data.roleId && data.roleId !== user.roleId) {
      if (user.id === currentUserId && user.role === ROLES.ADMINISTRADOR) {
        throw new AppError("No puedes cambiar tu propio rol de administrador", 403, "SELF_ROLE_CHANGE");
      }
      const role = await this._resolveRole(data.roleId, companyId);
      user.role = role.name;
      user.roleId = role.id;
    }

    if (data.password) {
      const strengthErrors = validatePasswordStrength(data.password);
      if (strengthErrors.length > 0) {
        throw new AppError("Contraseña débil", 422, "WEAK_PASSWORD", strengthErrors);
      }
      user.passwordHash = await hashPassword(data.password);
    }

    return userRepository.update(user);
  }

  async remove(id, companyId, currentUserId) {
    if (id === currentUserId) {
      throw new AppError("No puedes eliminar tu propia cuenta", 403, "SELF_DELETE");
    }

    const user = await this.getById(id, companyId);

    if (user.role === ROLES.ADMINISTRADOR) {
      const adminCount = await userRepository.countByRole(ROLES.ADMINISTRADOR, companyId);
      if (adminCount <= 1) {
        throw new AppError("Debe existir al menos un administrador", 409, "LAST_ADMIN");
      }
    }

    return userRepository.softDelete(id, companyId);
  }
}

export const userService = new UserService();
