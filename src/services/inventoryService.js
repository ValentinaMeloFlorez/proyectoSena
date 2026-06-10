import crypto from "crypto";
import { InventoryMovement } from "../models/InventoryMovement.js";
import { inventoryRepository } from "../repositories/inventoryRepository.js";
import { productRepository } from "../repositories/productRepository.js";
import { AppError } from "../utils/AppError.js";

const MOVEMENT_TYPES = ["entry", "exit", "adjustment"];

export class InventoryService {
  async list(companyId, query = {}) {
    return inventoryRepository.list(companyId, query);
  }

  async createMovement(data, companyId, userId) {
    const type = String(data.type || "").toLowerCase();
    if (!MOVEMENT_TYPES.includes(type)) {
      throw new AppError("Tipo de movimiento inválido", 422, "VALIDATION_ERROR");
    }

    const product = await productRepository.findById(data.productId);
    if (!product || product.companyId !== companyId) {
      throw new AppError("Producto no encontrado para el movimiento", 404, "PRODUCT_NOT_FOUND");
    }

    const reason = String(data.reason || "Movimiento de inventario").trim();
    let quantity = Number(data.quantity ?? 0);
    let previousStock = Number(product.stock);
    let resultingStock = previousStock;

    if (type === "adjustment") {
      const newStock = Number(data.newStock ?? NaN);
      if (Number.isNaN(newStock) || newStock < 0) {
        throw new AppError("El stock ajustado debe ser un número válido y no negativo", 422, "VALIDATION_ERROR");
      }
      quantity = Math.abs(newStock - previousStock);
      resultingStock = newStock;
    } else {
      if (quantity <= 0) {
        throw new AppError("La cantidad debe ser mayor a cero", 422, "VALIDATION_ERROR");
      }
      if (type === "entry") {
        resultingStock = previousStock + quantity;
      } else {
        resultingStock = previousStock - quantity;
      }
    }

    if (resultingStock < 0) {
      throw new AppError("El movimiento dejaría stock negativo", 409, "OUT_OF_STOCK");
    }

    await productRepository.updateStock(product.id, resultingStock - previousStock, companyId);

    const movement = new InventoryMovement({
      id: crypto.randomUUID(),
      productId: product.id,
      type,
      quantity,
      previousStock,
      resultingStock,
      reason,
      performedBy: userId,
      performedAt: new Date().toISOString(),
      companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    return inventoryRepository.create(movement);
  }
}

export const inventoryService = new InventoryService();
