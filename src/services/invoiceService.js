import crypto from "crypto";
import { Invoice } from "../models/Invoice.js";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { clientRepository } from "../repositories/clientRepository.js";
import { productRepository } from "../repositories/productRepository.js";
import { inventoryRepository } from "../repositories/inventoryRepository.js";
import { InventoryMovement } from "../models/InventoryMovement.js";
import { AppError } from "../utils/AppError.js";

const TAX_RATE = 0.19;

export class InvoiceService {
  async list(companyId, query = {}) {
    return invoiceRepository.list(companyId, query);
  }

  async getById(id, companyId) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice || invoice.companyId !== companyId) {
      throw new AppError("Factura no encontrada", 404, "INVOICE_NOT_FOUND");
    }
    return invoice;
  }

  async create(data, companyId, createdBy) {
    const client = await clientRepository.findById(data.clientId);
    if (!client || client.companyId !== companyId) {
      throw new AppError("Cliente no encontrado", 404, "CLIENT_NOT_FOUND");
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new AppError("La factura debe contener al menos un producto", 422, "VALIDATION_ERROR");
    }

    const items = [];
    let subTotal = 0;

    for (const item of data.items) {
      const quantity = Number(item.quantity ?? 0);
      if (quantity <= 0) {
        throw new AppError("La cantidad debe ser mayor a cero", 422, "VALIDATION_ERROR");
      }

      const product = await productRepository.findById(item.productId);
      if (!product || product.companyId !== companyId) {
        throw new AppError(`Producto no encontrado: ${item.productId}`, 404, "PRODUCT_NOT_FOUND");
      }

      if (quantity > product.stock) {
        throw new AppError(`No hay suficiente stock para ${product.name}`, 409, "OUT_OF_STOCK");
      }

      const unitPrice = Number(item.unitPrice ?? product.salePrice);
      const lineTotal = Number((unitPrice * quantity).toFixed(2));
      subTotal += lineTotal;

      items.push({
        productId: product.id,
        description: product.name,
        quantity,
        unitPrice,
        lineTotal,
      });
    }

    subTotal = Number(subTotal.toFixed(2));
    const taxAmount = Number((subTotal * TAX_RATE).toFixed(2));
    const total = Number((subTotal + taxAmount).toFixed(2));

    const invoice = new Invoice({
      id: crypto.randomUUID(),
      invoiceNumber: `FAC-${Math.floor(Date.now() / 1000)}`,
      clientId: client.id,
      clientName: client.name,
      items,
      subTotal,
      taxAmount,
      total,
      issuedAt: new Date().toISOString(),
      companyId,
      createdBy,
      updatedBy: createdBy,
    });

    const createdInvoice = await invoiceRepository.create(invoice);

    for (const item of items) {
      await productRepository.updateStock(item.productId, -item.quantity, companyId);
      const product = await productRepository.findById(item.productId);
      const movement = new InventoryMovement({
        id: crypto.randomUUID(),
        productId: item.productId,
        type: "exit",
        quantity: item.quantity,
        previousStock: product.stock + item.quantity,
        resultingStock: product.stock,
        reason: `Venta ${createdInvoice.invoiceNumber}`,
        performedBy: createdBy,
        performedAt: new Date().toISOString(),
        companyId,
        createdBy,
        updatedBy: createdBy,
      });
      await inventoryRepository.create(movement);
    }

    return createdInvoice;
  }
}

export const invoiceService = new InvoiceService();
