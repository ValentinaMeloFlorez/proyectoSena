/**
 * Repositorio de facturas — JSON
 */

import { Invoice } from "../models/Invoice.js";
import { JsonRepository } from "./JsonRepository.js";

const repo = new JsonRepository("invoices.json");

export class InvoiceRepository {
  async list(companyId = "default-company", { search, page = 1, limit = 20 } = {}) {
    let all = await repo.findAll();
    all = all.filter((i) => (!i.companyId || i.companyId === companyId) && i.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (i) =>
          i.number?.toLowerCase().includes(s) ||
          i.status?.toLowerCase().includes(s)
      );
    }

    all.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt));

    const paginated = repo._paginate(all, page, limit);
    return { ...paginated, items: paginated.items.map((i) => new Invoice(i)) };
  }

  async findById(id) {
    const record = await repo.findById(id);
    return record ? new Invoice(record) : null;
  }

  async create(invoice) {
    const data = invoice.toStorage();
    await repo.save(data);
    return invoice;
  }

  async update(invoice) {
    const data = invoice.toStorage();
    data.updatedAt = new Date().toISOString();
    await repo.save(data);
    return invoice;
  }
}

export const invoiceRepository = new InvoiceRepository();
