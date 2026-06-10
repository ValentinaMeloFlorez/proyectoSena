/**
 * Repositorio base para MySQL — proporciona operaciones CRUD genéricas
 */

import { query } from "../core/database.js";

export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Obtiene un registro por ID
   */
  async findById(id) {
    const results = await query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Obtiene todos los registros
   */
  async findAll() {
    return query(`SELECT * FROM ${this.tableName}`);
  }

  /**
   * Obtiene registros con filtro (objeto)
   */
  async findWhere(conditions = {}) {
    const keys = Object.keys(conditions);
    if (keys.length === 0) {
      return this.findAll();
    }

    const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
    const values = keys.map((key) => conditions[key]);

    return query(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause}`,
      values
    );
  }

  /**
   * Obtiene un registro con filtro
   */
  async findOne(conditions) {
    const results = await this.findWhere(conditions);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Inserta un nuevo registro
   */
  async create(data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(",");
    const values = keys.map((key) => data[key]);

    const insertSQL = `
      INSERT INTO ${this.tableName} (${keys.join(",")})
      VALUES (${placeholders})
    `;

    await query(insertSQL, values);
    return data;
  }

  /**
   * Actualiza un registro
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map((key) => `${key} = ?`).join(",");
    const values = [...keys.map((key) => data[key]), id];

    const updateSQL = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = ?
    `;

    const result = await query(updateSQL, values);
    return result.affectedRows > 0;
  }

  /**
   * Elimina un registro
   */
  async delete(id) {
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Ejecuta una consulta personalizada
   */
  async executeQuery(sql, values = []) {
    return query(sql, values);
  }

  /**
   * Cuenta registros con filtro
   */
  async count(conditions = {}) {
    const keys = Object.keys(conditions);
    let countSQL = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    let values = [];

    if (keys.length > 0) {
      const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
      values = keys.map((key) => conditions[key]);
      countSQL += ` WHERE ${whereClause}`;
    }

    const result = await query(countSQL, values);
    return result[0]?.count || 0;
  }
}
