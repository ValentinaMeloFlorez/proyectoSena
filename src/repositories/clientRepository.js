import { Client } from "../models/Client.js";
import { query } from "../core/database.js";

export class ClientRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM clients WHERE isActive = true`;
    let values = [];

    if (search) {
      const searchTerm = `%${search}%`;
      sql += ` AND (name LIKE ? OR document LIKE ? OR email LIKE ?)`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM clients WHERE isActive = true ${
        search ? `AND (name LIKE ? OR document LIKE ? OR email LIKE ?)` : ""
      }`,
      search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
    );
    const total = countResult[0].count;

    const offset = (page - 1) * limit;
    sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const results = await query(sql, values);
    return {
      items: results.map((c) => new Client(c)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id, includeInactive = false) {
    const sql = includeInactive
      ? `SELECT * FROM clients WHERE id = ?`
      : `SELECT * FROM clients WHERE id = ? AND isActive = true`;

    const results = await query(sql, [id]);
    return results.length > 0 ? new Client(results[0]) : null;
  }

  async findByDocument(document, companyId = "default-company", excludeId = null) {
    let sql = `SELECT * FROM clients WHERE document = ? AND isActive = true`;
    let values = [document];

    if (excludeId) {
      sql += ` AND id != ?`;
      values.push(excludeId);
    }

    const results = await query(sql, values);
    return results.length > 0 ? new Client(results[0]) : null;
  }

  async create(client) {
    const clientData = client.toStorage();
    await query(
      `INSERT INTO clients (id, name, email, phone, address, city, state, zipCode, country, document, companyName, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.city,
        clientData.state,
        clientData.zipCode,
        clientData.country,
        clientData.document,
        clientData.companyName,
        clientData.isActive,
        clientData.createdAt,
        clientData.updatedAt,
      ]
    );
    return client;
  }

  async update(client) {
    const clientData = client.toStorage();
    clientData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, document = ?, companyName = ?, isActive = ?, updatedAt = ? WHERE id = ?`,
      [
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.city,
        clientData.state,
        clientData.zipCode,
        clientData.country,
        clientData.document,
        clientData.companyName,
        clientData.isActive,
        clientData.updatedAt,
        clientData.id,
      ]
    );
    return client;
  }

  async remove(id, companyId = "default-company") {
    const result = await query(
      `UPDATE clients SET isActive = false, updatedAt = ? WHERE id = ?`,
      [new Date().toISOString(), id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id, true);
  }
}

export const clientRepository = new ClientRepository();
