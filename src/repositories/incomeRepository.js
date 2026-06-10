/**
 * Repositorio de ingresos — JSON
 */

import { Income } from "../models/Income.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("incomes.json");

export class IncomeRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();
    all = all.filter((i) => (!i.companyId || i.companyId === companyId) && i.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (i) =>
          i.concept?.toLowerCase().includes(s) ||
          String(i.value).includes(s)
      );
    }

    all.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt));

    const paginated = repo._paginate(all, page, limit);
    return { ...paginated, items: paginated.items.map((i) => new Income(i)) };
  }

  async findById(id) {
    const record = await repo.findById(id);
    return record ? new Income(record) : null;
  }

  async create(income) {
    const data = income.toStorage();
    await repo.save(data);
    return income;
  }

  async update(income) {
    const data = income.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return income;
  }

  async remove(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record) return null;
    const income = new Income(record);
    await repo.deleteById(id);
    return income;
  }
}

export const incomeRepository = new IncomeRepository();
