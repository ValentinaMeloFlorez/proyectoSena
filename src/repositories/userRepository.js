/**
 * Repositorio de usuarios — JSON
 */

import { User } from "../models/User.js";
import { ROLES } from "../config/roles.js";
import { hashPassword } from "../utils/password.js";
import { JsonRepository } from "./JsonRepository.js";
import { roleRepository } from "./roleRepository.js";

const repo = new JsonRepository("users.json");
const blacklistRepo = new JsonRepository("token-blacklist.json");

class UserRepository {
  async seedIfEmpty() {
    const all = await repo.findAll();
    if (all.length > 0) return;

    const seeds = [
      { email: "admin@contaia.com", password: "Admin123!", firstName: "Administrador", lastName: "Sistema", document: "1000000001", role: ROLES.ADMINISTRADOR },
      { email: "contador@contaia.com", password: "Contador123!", firstName: "Carlos", lastName: "Contador", document: "1000000002", role: ROLES.CONTADOR },
      { email: "empleado@contaia.com", password: "Empleado123!", firstName: "Ana", lastName: "Empleada", document: "1000000003", role: ROLES.EMPLEADO },
      { email: "gerente@contaia.com", password: "Gerente123!", firstName: "Luis", lastName: "Gerente", document: "1000000004", role: ROLES.GERENTE },
    ];

    for (const s of seeds) {
      const roleRecord = await roleRepository.findByName(s.role);
      const user = new User({
        id: crypto.randomUUID(),
        email: s.email,
        passwordHash: await hashPassword(s.password),
        firstName: s.firstName,
        lastName: s.lastName,
        document: s.document,
        role: s.role,
        roleId: roleRecord?.id || null,
        companyId: "default-company",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
      });
      await repo.save(user.toStorage());
    }

    console.log("✔ Usuarios de prueba creados");
  }

  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();
    all = all.filter((u) => u.companyId === companyId && u.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (u) =>
          u.email?.toLowerCase().includes(s) ||
          u.firstName?.toLowerCase().includes(s) ||
          u.lastName?.toLowerCase().includes(s) ||
          u.document?.toLowerCase().includes(s)
      );
    }

    // Ordenar por createdAt desc
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit).map((u) => new User(u));

    return { items, total, page, limit, totalPages };
  }

  async countByRole(roleName, companyId = "default-company") {
    const all = await repo.findAll();
    return all.filter(
      (u) => u.role === roleName && u.companyId === companyId && u.isActive !== false
    ).length;
  }

  async findByEmail(email, activeOnly = true) {
    const record = await repo.findOne((u) => {
      const matches = u.email?.toLowerCase() === email.toLowerCase();
      return activeOnly ? matches && u.isActive !== false : matches;
    });
    return record ? new User(record) : null;
  }

  async findByDocument(document, companyId = "default-company", excludeId = null) {
    const record = await repo.findOne(
      (u) =>
        u.document === document &&
        u.companyId === companyId &&
        u.isActive !== false &&
        (excludeId ? u.id !== excludeId : true)
    );
    return record ? new User(record) : null;
  }

  async findById(id, includeInactive = false) {
    const record = await repo.findById(id);
    if (!record) return null;
    if (!includeInactive && record.isActive === false) return null;
    return new User(record);
  }

  async create(user) {
    const data = user.toStorage();
    await repo.save(data);
    return user;
  }

  async update(user) {
    const data = user.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return user;
  }

  async softDelete(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record || record.companyId !== companyId) return null;
    record.isActive = false;
    record.updatedAt = new Date().toISOString();
    await repo.save(record);
    return new User(record);
  }

  async updatePassword(userId, passwordHash) {
    const user = await this.findById(userId);
    if (!user) return null;
    user.passwordHash = passwordHash;
    return this.update(user);
  }

  // ─── Token blacklist ───────────────────────────────────────────────────────

  async addToBlacklist(token, expiresAt) {
    const all = await blacklistRepo.findAll();
    // Limpiar tokens expirados
    const now = new Date();
    const active = all.filter((t) => new Date(t.expiresAt) > now);
    active.push({ token, expiresAt });
    await blacklistRepo._writeFile(active);
  }

  async isBlacklisted(token) {
    const all = await blacklistRepo.findAll();
    const now = new Date();
    return all.some(
      (t) => t.token === token && new Date(t.expiresAt) > now
    );
  }
}

export const userRepository = new UserRepository();
