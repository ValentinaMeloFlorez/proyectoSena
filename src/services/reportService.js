import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { productRepository } from "../repositories/productRepository.js";
import { clientRepository } from "../repositories/clientRepository.js";
import { incomeRepository } from "../repositories/incomeRepository.js";
import { expenseRepository } from "../repositories/expenseRepository.js";

const REPORT_TYPES = {
  SALES: "sales",
  INVENTORY: "inventory",
  CLIENTS: "clients",
  FINANCIAL: "financial",
};

export class ReportService {
  async generateSalesReport(companyId, format = "pdf") {
    const invoices = (await invoiceRepository.list(companyId, { limit: 1000 })).items;
    const rows = invoices.map((invoice) => ({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      issuedAt: invoice.issuedAt,
      total: invoice.total,
    }));
    const title = "Reporte de Ventas";
    return this._buildReport(format, title, rows, [
      { header: "Factura", key: "invoiceNumber" },
      { header: "Cliente", key: "clientName" },
      { header: "Fecha", key: "issuedAt" },
      { header: "Total", key: "total" },
    ]);
  }

  async generateInventoryReport(companyId, format = "pdf") {
    const products = (await productRepository.list(companyId, { limit: 1000 })).items;
    const rows = products.map((product) => ({
      code: product.code,
      name: product.name,
      category: product.category,
      stock: product.stock,
      lowStock: product.lowStock ? "Sí" : "No",
    }));
    const title = "Reporte de Inventario";
    return this._buildReport(format, title, rows, [
      { header: "Código", key: "code" },
      { header: "Nombre", key: "name" },
      { header: "Categoría", key: "category" },
      { header: "Stock", key: "stock" },
      { header: "Stock bajo", key: "lowStock" },
    ]);
  }

  async generateClientsReport(companyId, format = "pdf") {
    const clients = (await clientRepository.list(companyId, { limit: 1000 })).items;
    const rows = clients.map((client) => ({
      name: client.name,
      document: client.document,
      email: client.email,
      phone: client.phone,
    }));
    const title = "Reporte de Clientes";
    return this._buildReport(format, title, rows, [
      { header: "Nombre", key: "name" },
      { header: "Documento", key: "document" },
      { header: "Correo", key: "email" },
      { header: "Teléfono", key: "phone" },
    ]);
  }

  async generateFinancialReport(companyId, format = "pdf") {
    const incomes = (await incomeRepository.list(companyId, { limit: 1000 })).items;
    const expenses = (await expenseRepository.list(companyId, { limit: 1000 })).items;
    const rows = [
      ...incomes.map((entry) => ({ type: "Ingreso", concept: entry.concept, date: entry.date, value: entry.value })),
      ...expenses.map((entry) => ({ type: "Egreso", concept: entry.concept, date: entry.date, value: entry.value })),
    ];
    const title = "Reporte Financiero";
    return this._buildReport(format, title, rows, [
      { header: "Tipo", key: "type" },
      { header: "Concepto", key: "concept" },
      { header: "Fecha", key: "date" },
      { header: "Valor", key: "value" },
    ]);
  }

  async _buildReport(format, title, rows, columns) {
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(title.substring(0, 31));
      sheet.columns = columns.map((column) => ({ header: column.header, key: column.key, width: 20 }));
      sheet.addRows(rows);
      const buffer = await workbook.xlsx.writeBuffer();
      return { buffer, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    const now = new Date().toLocaleString("es-CO");
    doc.fontSize(18).text(title, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#555").text(`Generado: ${now}`);
    doc.moveDown(1);

    const tableTop = doc.y;
    const columnWidth = 520 / columns.length;

    columns.forEach((column, index) => {
      doc.fontSize(10).fillColor("#111").text(column.header, 40 + index * columnWidth, tableTop, {
        width: columnWidth,
        align: "left",
      });
    });

    doc.moveDown(0.8);
    rows.forEach((row) => {
      columns.forEach((column, index) => {
        doc.fontSize(9).fillColor("#333").text(String(row[column.key] ?? ""), 40 + index * columnWidth, doc.y, {
          width: columnWidth,
          align: "left",
        });
      });
      doc.moveDown(0.6);
    });

    doc.end();
    const buffer = Buffer.concat(buffers);
    return { buffer, mimeType: "application/pdf" };
  }
}

export const reportService = new ReportService();
