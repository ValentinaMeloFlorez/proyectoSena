import { BaseModel } from "./BaseModel.js";

export class Invoice extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.invoiceNumber = data.invoiceNumber || `FAC-${Date.now()}`;
    this.clientId = data.clientId || null;
    this.clientName = data.clientName || "Cliente final";
    this.items = Array.isArray(data.items) ? data.items : [];
    this.subTotal = Number(data.subTotal ?? 0);
    this.taxAmount = Number(data.taxAmount ?? 0);
    this.total = Number(data.total ?? 0);
    this.companyId = data.companyId || "default-company";
    this.issuedAt = data.issuedAt || new Date().toISOString();
    this.createdBy = data.createdBy || null;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      invoiceNumber: this.invoiceNumber,
      clientId: this.clientId,
      clientName: this.clientName,
      items: this.items,
      subTotal: this.subTotal,
      taxAmount: this.taxAmount,
      total: this.total,
      issuedAt: this.issuedAt,
      companyId: this.companyId,
    };
  }

  toStorage() {
    return {
      ...super.toJSON(),
      invoiceNumber: this.invoiceNumber,
      clientId: this.clientId,
      clientName: this.clientName,
      items: this.items,
      subTotal: this.subTotal,
      taxAmount: this.taxAmount,
      total: this.total,
      issuedAt: this.issuedAt,
      companyId: this.companyId,
    };
  }
}
