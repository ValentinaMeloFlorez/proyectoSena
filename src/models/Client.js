import { BaseModel } from "./BaseModel.js";

export class Client extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || "";
    this.document = data.document || "";
    this.email = data.email || "";
    this.phone = data.phone || "";
    this.address = data.address || "";
    this.companyId = data.companyId || "default-company";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      document: this.document,
      email: this.email,
      phone: this.phone,
      address: this.address,
      companyId: this.companyId,
    };
  }

  toStorage() {
    return this.toJSON();
  }
}
