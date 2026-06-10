/**
 * Modelo de Usuario
 */

import { getPermissionsForRole } from "../config/roles.js";

export class User {
  constructor(data = {}) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.firstName = data.firstName || this._parseFirstName(data.fullName);
    this.lastName = data.lastName || this._parseLastName(data.fullName);
    this.document = data.document || "";
    this.role = data.role;
    this.roleId = data.roleId || null;
    this.companyId = data.companyId || "default-company";
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.lastLoginAt = data.lastLoginAt || null;
    this._permissions = data._permissions || null;
  }

  _parseFirstName(fullName = "") {
    const parts = (fullName || "").trim().split(" ");
    return parts[0] || "";
  }

  _parseLastName(fullName = "") {
    const parts = (fullName || "").trim().split(" ");
    return parts.slice(1).join(" ") || "";
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  setPermissions(permissions) {
    this._permissions = permissions;
  }

  get permissions() {
    if (this._permissions) return this._permissions;
    return getPermissionsForRole(this.role);
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      document: this.document,
      email: this.email,
      role: this.role,
      roleId: this.roleId,
      companyId: this.companyId,
      permissions: this.permissions,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt,
    };
  }

  toStorage() {
    return {
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      firstName: this.firstName,
      lastName: this.lastName,
      document: this.document,
      role: this.role,
      roleId: this.roleId,
      companyId: this.companyId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt,
    };
  }
}
