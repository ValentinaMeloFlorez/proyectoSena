/**
 * Repositorio de movimientos de inventario — JSON
 */

import { InventoryMovement } from "../models/InventoryMovement.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("inventory.json");

export class InventoryRepository {
  async list(companyId = "default-company", { productId, type, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();

    if (productId) {
      all = all.filter((i) => i.productId === productId);
    }

    if (type) {
      all = all.filter((i) => i.type === type);
    }

    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const paginated = repo._paginate(all, page, limit);
    return { ...paginated, items: paginated.items.map((i) => new InventoryMovement(i)) };
  }

  async findById(id) {
    const record = await repo.findById(id);
    return record ? new InventoryMovement(record) : null;
  }

  async create(movement) {
    const data = movement.toStorage();
    await repo.save(data);
    return movement;
  }
}

export const inventoryRepository = new InventoryRepository();
