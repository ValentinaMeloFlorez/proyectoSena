/**
 * Repositorio de roles — MySQL
 */

import { Role } from "../models/Role.js";
import { ROLE_PERMISSIONS, ROLES } from "../config/roles.js";
import { query } from "../core/database.js";

class RoleRepository {
  async seedSystemRoles() {
    const result = await query(`SELECT COUNT(*) as count FROM roles`);
    if (result[0].count > 0) {
      // Sincronizar permisos de roles existentes
      for (const [name, permissions] of Object.entries(ROLE_PERMISSIONS)) {
        await query(
          `UPDATE roles SET permissions = ? WHERE name = ? AND name IN (?, ?, ?, ?)`,
          [JSON.stringify(permissions), name, ROLES.ADMINISTRADOR, ROLES.CONTADOR, ROLES.EMPLEADO, ROLES.GERENTE]
        );
      }
      return;
    }

    for (const [name, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const roleId = crypto.randomUUID();
      await query(
        `INSERT INTO roles (id, name, description, permissions, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          roleId,
          name,
          `Rol del sistema: ${name}`,
          JSON.stringify(permissions),
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );
    }

    console.log("✔ Roles del sistema creados");
  }

  async findAll(companyId = "default-company") {
    const results = await query(
      `SELECT * FROM roles WHERE isActive = true ORDER BY name`
    );
    return results.map((r) => {
      if (typeof r.permissions === "string") {
        r.permissions = JSON.parse(r.permissions);
      }
      return new Role(r);
    });
  }

  async findById(id, companyId = "default-company") {
    const results = await query(
      `SELECT * FROM roles WHERE id = ? AND isActive = true`,
      [id]
    );
    if (results.length === 0) return null;
    const role = results[0];
    if (typeof role.permissions === "string") {
      role.permissions = JSON.parse(role.permissions);
    }
    return new Role(role);
  }

  async findByName(name, companyId = "default-company") {
    const results = await query(
      `SELECT * FROM roles WHERE LOWER(name) = LOWER(?) AND isActive = true`,
      [name]
    );
    if (results.length === 0) return null;
    const role = results[0];
    if (typeof role.permissions === "string") {
      role.permissions = JSON.parse(role.permissions);
    }
    return new Role(role);
  }

  async findByNameIncludingInactive(name, companyId = "default-company") {
    const results = await query(
      `SELECT * FROM roles WHERE LOWER(name) = LOWER(?)`,
      [name]
    );
    if (results.length === 0) return null;
    const role = results[0];
    if (typeof role.permissions === "string") {
      role.permissions = JSON.parse(role.permissions);
    }
    return new Role(role);
  }

  async create(role) {
    const roleData = role.toStorage();
    await query(
      `INSERT INTO roles (id, name, description, permissions, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        roleData.id,
        roleData.name,
        roleData.description,
        JSON.stringify(roleData.permissions),
        roleData.createdAt,
        roleData.updatedAt,
      ]
    );
    return role;
  }

  async update(role) {
    const roleData = role.toStorage();
    roleData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE roles SET name = ?, description = ?, permissions = ?, updatedAt = ? WHERE id = ?`,
      [
        roleData.name,
        roleData.description,
        JSON.stringify(roleData.permissions),
        roleData.updatedAt,
        roleData.id,
      ]
    );
    return role;
  }

  async softDelete(id, companyId = "default-company") {
    const result = await query(
      `UPDATE roles SET isActive = false, updatedAt = ? WHERE id = ?`,
      [new Date().toISOString(), id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id, companyId);
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
