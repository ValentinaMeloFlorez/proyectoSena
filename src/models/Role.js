/**
 * Modelo de Rol
 */

export class Role {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || "";
    this.permissions = data.permissions || [];
    this.isSystem = data.isSystem || false;
    this.companyId = data.companyId || "default-company";
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy || null;
    this.updatedBy = data.updatedBy || null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: this.permissions,
      permissionCount: this.permissions.length,
      isSystem: this.isSystem,
      companyId: this.companyId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toStorage() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: this.permissions,
      isSystem: this.isSystem,
      companyId: this.companyId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }
}
