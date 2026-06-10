/**
 * Repositorio de roles — JSON
 */

import { Role } from "../models/Role.js";
import { ROLE_PERMISSIONS, ROLES } from "../config/roles.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("roles.json");

class RoleRepository {
  async seedSystemRoles() {
    const all = await repo.findAll();
    if (all.length > 0) {
      // Sincronizar permisos de roles del sistema si ya existen
      for (const [name, permissions] of Object.entries(ROLE_PERMISSIONS)) {
        const existing = all.find(
          (r) => r.name.toLowerCase() === name.toLowerCase()
        );
        if (existing) {
          existing.permissions = permissions;
          existing.updatedAt = new Date().toISOString();
          await repo.save(existing);
        }
      }
      return;
    }

    // Crear roles del sistema por primera vez
    for (const [name, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const role = new Role({
        id: crypto.randomUUID(),
        name,
        description: `Rol del sistema: ${name}`,
        permissions,
        isSystem: true,
        companyId: "default-company",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      });
      await repo.save(role.toStorage());
    }

    console.log("✔ Roles del sistema creados");
  }

  async findAll(companyId = "default-company") {
    const all = await repo.findAll();
    return all
      .filter((r) => r.isActive !== false)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => new Role(r));
  }

  async findById(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record || record.isActive === false) return null;
    return new Role(record);
  }

  async findByName(name, companyId = "default-company") {
    const record = await repo.findOne(
      (r) => r.name.toLowerCase() === name.toLowerCase() && r.isActive !== false
    );
    return record ? new Role(record) : null;
  }

  async findByNameIncludingInactive(name, companyId = "default-company") {
    const record = await repo.findOne(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
    return record ? new Role(record) : null;
  }

  async create(role) {
    const data = role.toStorage();
    await repo.save(data);
    return role;
  }

  async update(role) {
    const data = role.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return role;
  }

  async softDelete(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record) return null;
    record.isActive = false;
    record.updatedAt = new Date().toISOString();
    await repo.save(record);
    return new Role(record);
  }

  async getPermissionsForRoleName(roleName, companyId = "default-company") {
    const role = await this.findByName(roleName, companyId);
    if (role) return role.permissions;
    return ROLE_PERMISSIONS[roleName] || [];
  }

  async getPermissionsForRoleId(roleId, companyId = "default-company") {
    const role = await this.findById(roleId, companyId);
    return role ? role.permissions : [];
  }
}

export const roleRepository = new RoleRepository();
