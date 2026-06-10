import { Income } from "../models/Income.js";
import { query } from "../core/database.js";

export class IncomeRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM incomes WHERE 1=1`;
    let values = [];

    if (search) {
      const searchTerm = `%${search}%`;
      sql += ` AND (description LIKE ? OR category LIKE ?)`;
      values.push(searchTerm, searchTerm);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM incomes WHERE 1=1 ${
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
      items: results.map((i) => new Income(i)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id) {
    const results = await query(`SELECT * FROM incomes WHERE id = ?`, [id]);
    return results.length > 0 ? new Income(results[0]) : null;
  }

  async create(income) {
    const incomeData = income.toStorage();
    await query(
      `INSERT INTO incomes (id, description, amount, date, category, source, reference, notes, createdBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incomeData.id,
        incomeData.description,
        incomeData.amount,
        incomeData.date,
        incomeData.category,
        incomeData.source,
        incomeData.reference,
        incomeData.notes,
        incomeData.createdBy,
        incomeData.createdAt,
        incomeData.updatedAt,
      ]
    );
    return income;
  }

  async update(income) {
    const incomeData = income.toStorage();
    incomeData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE incomes SET description = ?, amount = ?, date = ?, category = ?, source = ?, reference = ?, notes = ?, updatedAt = ? WHERE id = ?`,
      [
        incomeData.description,
        incomeData.amount,
        incomeData.date,
        incomeData.category,
        incomeData.source,
        incomeData.reference,
        incomeData.notes,
        incomeData.updatedAt,
        incomeData.id,
      ]
    );
    return income;
  }

  async remove(id, companyId = "default-company") {
    const result = await query(
      `DELETE FROM incomes WHERE id = ?`,
      [id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }
}

export const incomeRepository = new IncomeRepository();
