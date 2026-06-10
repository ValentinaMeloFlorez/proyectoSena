import { BaseModel } from "./BaseModel.js";

export class Product extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.code = data.code || "";
    this.name = data.name || "";
    this.category = data.category || "General";
    this.purchasePrice = Number(data.purchasePrice ?? 0);
    this.salePrice = Number(data.salePrice ?? 0);
    this.stock = Number(data.stock ?? 0);
    this.stockThreshold = Number(data.stockThreshold ?? 10);
    this.companyId = data.companyId || "default-company";
  }

  get lowStock() {
    return this.stock <= this.stockThreshold;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      code: this.code,
      name: this.name,
      category: this.category,
      purchasePrice: this.purchasePrice,
      salePrice: this.salePrice,
      stock: this.stock,
      stockThreshold: this.stockThreshold,
      lowStock: this.lowStock,
      companyId: this.companyId,
    };
  }

  toStorage() {
    return {
      ...super.toJSON(),
      code: this.code,
      name: this.name,
      category: this.category,
      purchasePrice: this.purchasePrice,
      salePrice: this.salePrice,
      stock: this.stock,
      stockThreshold: this.stockThreshold,
      companyId: this.companyId,
    };
  }
}
