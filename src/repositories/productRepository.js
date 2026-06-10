import { Product } from "../models/Product.js";
import { query } from "../core/database.js";

export class ProductRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let sql = `SELECT * FROM products WHERE isActive = true`;
    let values = [];

    if (search) {
      const searchTerm = `%${search}%`;
      sql += ` AND (name LIKE ? OR sku LIKE ? OR category LIKE ?)`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM products WHERE isActive = true ${
        search ? `AND (name LIKE ? OR sku LIKE ? OR category LIKE ?)` : ""
      }`,
      search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
    );
    const total = countResult[0].count;

    const offset = (page - 1) * limit;
    sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const results = await query(sql, values);
    return {
      items: results.map((p) => new Product(p)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id, includeInactive = false) {
    const sql = includeInactive
      ? `SELECT * FROM products WHERE id = ?`
      : `SELECT * FROM products WHERE id = ? AND isActive = true`;

    const results = await query(sql, [id]);
    return results.length > 0 ? new Product(results[0]) : null;
  }

  async findBySku(sku, companyId = "default-company", excludeId = null) {
    let sql = `SELECT * FROM products WHERE LOWER(sku) = LOWER(?) AND isActive = true`;
    let values = [sku];

    if (excludeId) {
      sql += ` AND id != ?`;
      values.push(excludeId);
    }

    const results = await query(sql, values);
    return results.length > 0 ? new Product(results[0]) : null;
  }

  async findByName(name, companyId = "default-company", excludeId = null) {
    let sql = `SELECT * FROM products WHERE LOWER(name) = LOWER(?) AND isActive = true`;
    let values = [name];

    if (excludeId) {
      sql += ` AND id != ?`;
      values.push(excludeId);
    }

    const results = await query(sql, values);
    return results.length > 0 ? new Product(results[0]) : null;
  }

  async create(product) {
    const productData = product.toStorage();
    await query(
      `INSERT INTO products (id, name, description, price, cost, sku, category, quantity, unit, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productData.id,
        productData.name,
        productData.description,
        productData.price,
        productData.cost,
        productData.sku,
        productData.category,
        productData.quantity || 0,
        productData.unit,
        productData.isActive,
        productData.createdAt,
        productData.updatedAt,
      ]
    );
    return product;
  }

  async update(product) {
    const productData = product.toStorage();
    productData.updatedAt = new Date().toISOString();

    await query(
      `UPDATE products SET name = ?, description = ?, price = ?, cost = ?, sku = ?, category = ?, quantity = ?, unit = ?, isActive = ?, updatedAt = ? WHERE id = ?`,
      [
        productData.name,
        productData.description,
        productData.price,
        productData.cost,
        productData.sku,
        productData.category,
        productData.quantity || 0,
        productData.unit,
        productData.isActive,
        productData.updatedAt,
        productData.id,
      ]
    );
    return product;
  }

  async remove(id, companyId = "default-company") {
    const result = await query(
      `UPDATE products SET isActive = false, updatedAt = ? WHERE id = ?`,
      [new Date().toISOString(), id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id, true);
  }

  async updateStock(id, delta, companyId = "default-company") {
    const product = await this.findById(id);
    if (!product) return null;
    product.quantity = Math.max(0, (product.quantity || 0) + delta);
    return this.update(product);
  }
}

export const productRepository = new ProductRepository();
}

export const productRepository = new ProductRepository();
