import { Invoice } from "../models/Invoice.js";
import { query } from "../core/database.js";

export class InvoiceRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM invoices WHERE 1=1`;
    let values = [];

    if (search) {
      const searchTerm = `%${search}%`;
      sql += ` AND (number LIKE ? OR status LIKE ?)`;
      values.push(searchTerm, searchTerm);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM invoices WHERE 1=1 ${
        search ? `AND (number LIKE ? OR status LIKE ?)` : ""
      }`,
      search ? [`%${search}%`, `%${search}%`] : []
    );
    const total = countResult[0].count;

    const offset = (page - 1) * limit;
    sql += ` ORDER BY date DESC, createdAt DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const results = await query(sql, values);
    return {
      items: results.map((i) => {
        if (typeof i.items === "string") {
          i.items = JSON.parse(i.items);
        }
        return new Invoice(i);
      }),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id) {
    const results = await query(`SELECT * FROM invoices WHERE id = ?`, [id]);
    if (results.length === 0) return null;
    const invoice = results[0];
    if (typeof invoice.items === "string") {
      invoice.items = JSON.parse(invoice.items);
    }
    return new Invoice(invoice);
  }

  async create(invoice) {
    const invoiceData = invoice.toStorage();
    await query(
      `INSERT INTO invoices (id, number, clientId, date, dueDate, items, subtotal, tax, total, status, notes, createdBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoiceData.id,
        invoiceData.number,
        invoiceData.clientId,
        invoiceData.date,
        invoiceData.dueDate,
        JSON.stringify(invoiceData.items || []),
        invoiceData.subtotal,
        invoiceData.tax,
        invoiceData.total,
        invoiceData.status,
        invoiceData.notes,
        invoiceData.createdBy,
        invoiceData.createdAt,
        invoiceData.updatedAt,
      ]
    );
    return invoice;
  }

  async update(invoice) {
    const invoiceData = invoice.toStorage();
    invoiceData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE invoices SET number = ?, clientId = ?, date = ?, dueDate = ?, items = ?, subtotal = ?, tax = ?, total = ?, status = ?, notes = ?, updatedAt = ? WHERE id = ?`,
      [
        invoiceData.number,
        invoiceData.clientId,
        invoiceData.date,
        invoiceData.dueDate,
        JSON.stringify(invoiceData.items || []),
        invoiceData.subtotal,
        invoiceData.tax,
        invoiceData.total,
        invoiceData.status,
        invoiceData.notes,
        invoiceData.updatedAt,
        invoiceData.id,
      ]
    );
    return invoice;
  }
}

export const invoiceRepository = new InvoiceRepository();
