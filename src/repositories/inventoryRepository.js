import { InventoryMovement } from "../models/InventoryMovement.js";
import { query } from "../core/database.js";

export class InventoryRepository {
  async list(companyId = "default-company", { productId, type, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM inventory_movements WHERE 1=1`;
    let values = [];

    if (productId) {
      sql += ` AND productId = ?`;
      values.push(productId);
    }

    if (type) {
      sql += ` AND type = ?`;
      values.push(type);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM inventory_movements WHERE 1=1 ${
        productId ? `AND productId = ?` : ""
      } ${type ? `AND type = ?` : ""}`,
      values
    );
    const total = countResult[0].count;

    const offset = (page - 1) * limit;
    sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const results = await query(sql, values);
    return {
      items: results.map((i) => new InventoryMovement(i)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id) {
    const results = await query(`SELECT * FROM inventory_movements WHERE id = ?`, [id]);
    return results.length > 0 ? new InventoryMovement(results[0]) : null;
  }

  async create(movement) {
    const movementData = movement.toStorage();
    await query(
      `INSERT INTO inventory_movements (id, productId, type, quantity, reason, reference, createdBy, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movementData.id,
        movementData.productId,
        movementData.type,
        movementData.quantity,
        movementData.reason,
        movementData.reference,
        movementData.createdBy,
        movementData.createdAt,
      ]
    );
    return movement;
  }
}

export const inventoryRepository = new InventoryRepository();
