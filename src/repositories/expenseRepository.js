/**
 * Repositorio de gastos — JSON
 */

import { Expense } from "../models/Expense.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("expenses.json");

export class ExpenseRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();
    all = all.filter((e) => (!e.companyId || e.companyId === companyId) && e.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (e) =>
          e.concept?.toLowerCase().includes(s) ||
          String(e.value).includes(s)
      );
    }

    all.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt));

    const paginated = repo._paginate(all, page, limit);
    return { ...paginated, items: paginated.items.map((e) => new Expense(e)) };
  }

  async findById(id) {
    const record = await repo.findById(id);
    return record ? new Expense(record) : null;
  }

  async create(expense) {
    const data = expense.toStorage();
    await repo.save(data);
    return expense;
  }

  async update(expense) {
    const data = expense.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return expense;
  }

  async remove(id, companyId = "default-company") {
    const record = await repo.findById(id);
    if (!record) return null;
    const expense = new Expense(record);
    await repo.deleteById(id);
    return expense;
  }
}

export const expenseRepository = new ExpenseRepository();
