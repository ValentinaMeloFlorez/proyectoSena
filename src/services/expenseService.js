import crypto from "crypto";
import { Expense } from "../models/Expense.js";
import { expenseRepository } from "../repositories/expenseRepository.js";
import { AppError } from "../utils/AppError.js";

export class ExpenseService {
  async list(companyId, query = {}) {
    return expenseRepository.list(companyId, query);
  }

  async getById(id, companyId) {
    const expense = await expenseRepository.findById(id);
    if (!expense || expense.companyId !== companyId) {
      throw new AppError("Egreso no encontrado", 404, "EXPENSE_NOT_FOUND");
    }
    return expense;
  }

  async create(data, companyId, createdBy) {
    const concept = String(data.concept || "").trim();
    const value = Number(data.value ?? 0);
    const date = data.date || new Date().toISOString();

    if (!concept) {
      throw new AppError("El concepto es obligatorio", 422, "VALIDATION_ERROR");
    }
    if (value <= 0) {
      throw new AppError("El valor debe ser mayor a cero", 422, "VALIDATION_ERROR");
    }

    const expense = new Expense({
      id: crypto.randomUUID(),
      concept,
      value,
      date,
      companyId,
      createdBy,
      updatedBy: createdBy,
    });

    return expenseRepository.create(expense);
  }

  async update(id, data, companyId, updatedBy) {
    const expense = await this.getById(id, companyId);
    if (data.concept) expense.concept = String(data.concept).trim();
    if (data.value !== undefined) {
      const value = Number(data.value);
      if (value <= 0) {
        throw new AppError("El valor debe ser mayor a cero", 422, "VALIDATION_ERROR");
      }
      expense.value = value;
    }
    if (data.date) expense.date = data.date;
    expense.updatedBy = updatedBy;
    return expenseRepository.update(expense);
  }

  async remove(id, companyId) {
    await this.getById(id, companyId);
    return expenseRepository.remove(id, companyId);
  }
}

export const expenseService = new ExpenseService();
