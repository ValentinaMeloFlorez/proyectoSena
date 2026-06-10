import { BaseModel } from "./BaseModel.js";

export class InventoryMovement extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.productId = data.productId || null;
    this.type = data.type || "entry";
    this.quantity = Number(data.quantity ?? 0);
    this.previousStock = Number(data.previousStock ?? 0);
    this.resultingStock = Number(data.resultingStock ?? 0);
    this.reason = data.reason || "Movimiento de inventario";
    this.performedBy = data.performedBy || null;
    this.performedAt = data.performedAt || new Date().toISOString();
    this.companyId = data.companyId || "default-company";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      productId: this.productId,
      type: this.type,
      quantity: this.quantity,
      previousStock: this.previousStock,
      resultingStock: this.resultingStock,
      reason: this.reason,
      performedBy: this.performedBy,
      performedAt: this.performedAt,
      companyId: this.companyId,
    };
  }

  toStorage() {
    return {
      ...super.toJSON(),
      productId: this.productId,
      type: this.type,
      quantity: this.quantity,
      previousStock: this.previousStock,
      resultingStock: this.resultingStock,
      reason: this.reason,
      performedBy: this.performedBy,
      performedAt: this.performedAt,
      companyId: this.companyId,
    };
  }
}
