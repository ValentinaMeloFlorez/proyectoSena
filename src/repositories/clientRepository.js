/**
 * Repositorio de clientes — JSON
 */

import { Client } from "../models/Client.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("clients.json");

export class ClientRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();
    all = all.filter((c) => (!c.companyId || c.companyId === companyId) && c.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (c) =>
          c.name?.toLowerCase().includes(s) ||
          c.document?.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s)
      );
    }

    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const paginated = repo._paginate(all, page, limit);
    return { ...paginated, items: paginated.items.map((c) => new Client(c)) };
  }

  async findById(id, includeInactive = false) {
    const record = await repo.findById(id);
    if (!record) return null;
    if (!includeInactive && record.isActive === false) return null;
    return new Client(record);
  }

  async findByDocument(document, companyId = "default-company", excludeId = null) {
    const record = await repo.findOne(
      (c) =>
        c.document === document &&
        c.isActive !== false &&
        (excludeId ? c.id !== excludeId : true)
    );
    return record ? new Client(record) : null;
  }

  async create(client) {
    const data = client.toStorage();
    await repo.save(data);
    return client;
  }

  async update(client) {
    const data = client.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return client;
  }

  async remove(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record) return null;
    record.isActive = false;
    record.updatedAt = new Date().toISOString();
    await repo.save(record);
    return new Client(record);
  }
}

export const clientRepository = new ClientRepository();
