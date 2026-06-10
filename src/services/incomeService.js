import crypto from "crypto";
import { Income } from "../models/Income.js";
import { incomeRepository } from "../repositories/incomeRepository.js";
import { AppError } from "../utils/AppError.js";

export class IncomeService {
  async list(companyId, query = {}) {
    return incomeRepository.list(companyId, query);
  }

  async getById(id, companyId) {
    const income = await incomeRepository.findById(id);
    if (!income || income.companyId !== companyId) {
      throw new AppError("Ingreso no encontrado", 404, "INCOME_NOT_FOUND");
    }
    return income;
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

    const income = new Income({
      id: crypto.randomUUID(),
      concept,
      value,
      date,
      companyId,
      createdBy,
      updatedBy: createdBy,
    });

    return incomeRepository.create(income);
  }

  async update(id, data, companyId, updatedBy) {
    const income = await this.getById(id, companyId);
    if (data.concept) income.concept = String(data.concept).trim();
    if (data.value !== undefined) {
      const value = Number(data.value);
      if (value <= 0) {
        throw new AppError("El valor debe ser mayor a cero", 422, "VALIDATION_ERROR");
      }
      income.value = value;
    }
    if (data.date) income.date = data.date;
    income.updatedBy = updatedBy;
    return incomeRepository.update(income);
  }

  async remove(id, companyId) {
    await this.getById(id, companyId);
    return incomeRepository.remove(id, companyId);
  }
}

export const incomeService = new IncomeService();
