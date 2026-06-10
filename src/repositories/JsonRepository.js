/**
 * Repositorio base para JSON — lectura y escritura de archivos .json como base de datos
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../../data");

export class JsonRepository {
  constructor(filename) {
    this.filePath = path.join(DATA_DIR, filename);
  }

  async _ensureDataDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  async _readFile() {
    await this._ensureDataDir();
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await this._ensureDataDir();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  async findAll() {
    return this._readFile();
  }

  async findById(id) {
    const all = await this._readFile();
    return all.find((item) => item.id === id) || null;
  }

  async findOne(predicate) {
    const all = await this._readFile();
    return all.find(predicate) || null;
  }

  async filter(predicate) {
    const all = await this._readFile();
    return all.filter(predicate);
  }

  async save(record) {
    const all = await this._readFile();
    const idx = all.findIndex((item) => item.id === record.id);
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.push(record);
    }
    await this._writeFile(all);
    return record;
  }

  async deleteById(id) {
    const all = await this._readFile();
    const idx = all.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    all.splice(idx, 1);
    await this._writeFile(all);
    return true;
  }

  /**
   * Paginación genérica sobre un array ya filtrado
   */
  _paginate(items, page = 1, limit = 20) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
