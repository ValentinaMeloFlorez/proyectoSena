import { productRepository } from "../repositories/productRepository.js";
import { clientRepository } from "../repositories/clientRepository.js";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { incomeRepository } from "../repositories/incomeRepository.js";
import { expenseRepository } from "../repositories/expenseRepository.js";

export class DashboardService {
  async metrics(companyId) {
    const [products, clients, invoices, incomes, expenses] = await Promise.all([
      productRepository.list(companyId, { limit: 1000 }),
      clientRepository.list(companyId, { limit: 1000 }),
      invoiceRepository.list(companyId, { limit: 1000 }),
      incomeRepository.list(companyId, { limit: 1000 }),
      expenseRepository.list(companyId, { limit: 1000 }),
    ]);

    return {
      totalSales: invoices.items.reduce((sum, invoice) => sum + invoice.total, 0),
      totalClients: clients.total,
      totalProducts: products.total,
      totalSuppliers: 0,
      totalIncome: incomes.items.reduce((sum, entry) => sum + entry.value, 0),
      totalExpenses: expenses.items.reduce((sum, entry) => sum + entry.value, 0),
      lowStockProducts: products.items.filter((product) => product.lowStock).length,
      recentInvoices: invoices.items.slice(0, 5),
    };
  }
}

export const dashboardService = new DashboardService();
