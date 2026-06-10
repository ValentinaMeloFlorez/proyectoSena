/**
 * Modelo base — campos comunes de auditoría
 * Los modelos concretos extenderán esta clase en módulos futuros
 */
export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdBy = data.createdBy || null;
    this.updatedBy = data.updatedBy || null;
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }
}
