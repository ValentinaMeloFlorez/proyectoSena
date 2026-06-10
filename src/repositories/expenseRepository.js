import { Expense } from "../models/Expense.js";
import { query } from "../core/database.js";

export class ExpenseRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM expenses WHERE 1=1`;
    let values = [];

    if (search) {
      const searchTerm = `%${search}%`;
      sql += ` AND (description LIKE ? OR category LIKE ?)`;
      values.push(searchTerm, searchTerm);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM expenses WHERE 1=1 ${
        search ? `AND (description LIKE ? OR category LIKE ?)` : ""
      }`,
      search ? [`%${search}%`, `%${search}%`] : []
    );
    const total = countResult[0].count;

    const offset = (page - 1) * limit;
    sql += ` ORDER BY date DESC, createdAt DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const results = await query(sql, values);
    return {
      items: results.map((e) => new Expense(e)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id) {
    const results = await query(`SELECT * FROM expenses WHERE id = ?`, [id]);
    return results.length > 0 ? new Expense(results[0]) : null;
  }

  async create(expense) {
    const expenseData = expense.toStorage();
    await query(
      `INSERT INTO expenses (id, description, amount, date, category, vendor, reference, notes, createdBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expenseData.id,
        expenseData.description,
        expenseData.amount,
        expenseData.date,
        expenseData.category,
        expenseData.vendor,
        expenseData.reference,
        expenseData.notes,
        expenseData.createdBy,
        expenseData.createdAt,
        expenseData.updatedAt,
      ]
    );
    return expense;
  }

  async update(expense) {
    const expenseData = expense.toStorage();
    expenseData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE expenses SET description = ?, amount = ?, date = ?, category = ?, vendor = ?, reference = ?, notes = ?, updatedAt = ? WHERE id = ?`,
      [
        expenseData.description,
        expenseData.amount,
        expenseData.date,
        expenseData.category,
        expenseData.vendor,
        expenseData.reference,
        expenseData.notes,
        expenseData.updatedAt,
        expenseData.id,
      ]
    );
    return expense;
  }

  async remove(id, companyId = "default-company") {
    const result = await query(
      `DELETE FROM expenses WHERE id = ?`,
      [id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }
}

export const expenseRepository = new ExpenseRepository();
