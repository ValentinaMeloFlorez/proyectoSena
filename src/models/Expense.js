import { BaseModel } from "./BaseModel.js";

export class Expense extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.concept = data.concept || "Egreso";
    this.value = Number(data.value ?? 0);
    this.date = data.date || new Date().toISOString();
    this.companyId = data.companyId || "default-company";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      concept: this.concept,
      value: this.value,
      date: this.date,
      companyId: this.companyId,
    };
  }

  toStorage() {
    return this.toJSON();
  }
}
