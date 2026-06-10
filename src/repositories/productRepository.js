/**
 * Repositorio de productos — JSON
 */

import { Product } from "../models/Product.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("products.json");

export class ProductRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();
    all = all.filter((p) => (!p.companyId || p.companyId === companyId) && p.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.code?.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s)
      );
    }

    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const paginated = repo._paginate(all, page, limit);
    return { ...paginated, items: paginated.items.map((p) => new Product(p)) };
  }

  async findById(id, includeInactive = false) {
    const record = await repo.findById(id);
    if (!record) return null;
    if (!includeInactive && record.isActive === false) return null;
    return new Product(record);
  }

  async findBySku(sku, companyId = "default-company", excludeId = null) {
    const record = await repo.findOne(
      (p) =>
        p.code?.toLowerCase() === sku.toLowerCase() &&
        p.isActive !== false &&
        (excludeId ? p.id !== excludeId : true)
    );
    return record ? new Product(record) : null;
  }

  async findByName(name, companyId = "default-company", excludeId = null) {
    const record = await repo.findOne(
      (p) =>
        p.name?.toLowerCase() === name.toLowerCase() &&
        p.isActive !== false &&
        (excludeId ? p.id !== excludeId : true)
    );
    return record ? new Product(record) : null;
  }

  async create(product) {
    const data = product.toStorage();
    await repo.save(data);
    return product;
  }

  async update(product) {
    const data = product.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return product;
  }

  async remove(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record) return null;
    record.isActive = false;
    record.updatedAt = new Date().toISOString();
    await repo.save(record);
    return new Product(record);
  }

  async updateStock(id, delta, companyId = "default-company") {
    const product = await this.findById(id);
    if (!product) return null;
    product.stock = Math.max(0, (product.stock || 0) + delta);
    return this.update(product);
  }
}

export const productRepository = new ProductRepository();
