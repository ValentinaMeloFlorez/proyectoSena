/**
 * Repositorio de usuarios — MySQL
 */

import { User } from "../models/User.js";
import { ROLES } from "../config/roles.js";
import { hashPassword } from "../utils/password.js";
import { query } from "../core/database.js";
import { roleRepository } from "./roleRepository.js";

class UserRepository {
  async seedIfEmpty() {
    const count = await query("SELECT COUNT(*) as count FROM users");
    if (count[0].count > 0) return;

    const seeds = [
      { email: "admin@contaia.com", password: "Admin123!", firstName: "Administrador", lastName: "Sistema", document: "1000000001", role: ROLES.ADMINISTRADOR },
      { email: "contador@contaia.com", password: "Contador123!", firstName: "Carlos", lastName: "Contador", document: "1000000002", role: ROLES.CONTADOR },
      { email: "empleado@contaia.com", password: "Empleado123!", firstName: "Ana", lastName: "Empleada", document: "1000000003", role: ROLES.EMPLEADO },
      { email: "gerente@contaia.com", password: "Gerente123!", firstName: "Luis", lastName: "Gerente", document: "1000000004", role: ROLES.GERENTE },
    ];

    for (const s of seeds) {
      const roleRecord = await roleRepository.findByName(s.role);
      const userId = crypto.randomUUID();

      await query(
        `INSERT INTO users (id, email, passwordHash, firstName, lastName, document, role, roleId, companyId, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          s.email,
          await hashPassword(s.password),
          s.firstName,
          s.lastName,
          s.document,
          s.role,
          roleRecord?.id || null,
          "default-company",
          true,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );
    }

    console.log("✔ Usuarios de prueba creados");
  }

  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM users WHERE companyId = ? AND isActive = true`;
    let values = [companyId];

    if (search) {
      const searchTerm = `%${search}%`;
      sql += ` AND (email LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR document LIKE ?)`;
      values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM users WHERE companyId = ? AND isActive = true ${
        search ? `AND (email LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR document LIKE ?)` : ""
      }`,
      values
    );
    const total = countResult[0].count;

    const offset = (page - 1) * limit;
    sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const results = await query(sql, values);
    const items = results.map((u) => new User(u));

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async countByRole(roleName, companyId = "default-company") {
    const result = await query(
      `SELECT COUNT(*) as count FROM users WHERE role = ? AND companyId = ? AND isActive = true`,
      [roleName, companyId]
    );
    return result[0].count;
  }

  async findByEmail(email, activeOnly = true) {
    const sql = activeOnly
      ? `SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND isActive = true`
      : `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`;

    const results = await query(sql, [email]);
    return results.length > 0 ? new User(results[0]) : null;
  }

  async findByDocument(document, companyId = "default-company", excludeId = null) {
    let sql = `SELECT * FROM users WHERE document = ? AND companyId = ? AND isActive = true`;
    let values = [document, companyId];

    if (excludeId) {
      sql += ` AND id != ?`;
      values.push(excludeId);
    }

    const results = await query(sql, values);
    return results.length > 0 ? new User(results[0]) : null;
  }

  async findById(id, includeInactive = false) {
    const sql = includeInactive
      ? `SELECT * FROM users WHERE id = ?`
      : `SELECT * FROM users WHERE id = ? AND isActive = true`;

    const results = await query(sql, [id]);
    return results.length > 0 ? new User(results[0]) : null;
  }

  async create(user) {
    const userData = user.toStorage();
    await query(
      `INSERT INTO users (id, email, passwordHash, firstName, lastName, document, role, roleId, companyId, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.id,
        userData.email,
        userData.passwordHash,
        userData.firstName,
        userData.lastName,
        userData.document,
        userData.role,
        userData.roleId,
        userData.companyId,
        userData.isActive,
        userData.createdAt,
        userData.updatedAt,
      ]
    );
    return user;
  }

  async update(user) {
    const userData = user.toStorage();
    userData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE users SET email = ?, firstName = ?, lastName = ?, document = ?, role = ?, roleId = ?, companyId = ?, isActive = ?, updatedAt = ? WHERE id = ?`,
      [
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.document,
        userData.role,
        userData.roleId,
        userData.companyId,
        userData.isActive,
        userData.updatedAt,
        userData.id,
      ]
    );
    return user;
  }

  async softDelete(id, companyId = "default-company") {
    const result = await query(
      `UPDATE users SET isActive = false, updatedAt = ? WHERE id = ? AND companyId = ?`,
      [new Date().toISOString(), id, companyId]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id, true);
  }

  async updatePassword(userId, passwordHash) {
    const user = await this.findById(userId);
    if (!user) return null;
    user.passwordHash = passwordHash;
    return this.update(user);
  }

  async addToBlacklist(token, expiresAt) {
    await query(
      `INSERT INTO token_blacklist (token, expiresAt) VALUES (?, ?)`,
      [token, expiresAt]
    );
    // Limpiar tokens expirados
    await query(`DELETE FROM token_blacklist WHERE expiresAt < NOW()`);
  }

  async isBlacklisted(token) {
    const results = await query(
      `SELECT id FROM token_blacklist WHERE token = ? AND expiresAt > NOW()`,
      [token]
    );
    return results.length > 0;
  }
}

export const userRepository = new UserRepository();
