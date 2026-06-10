import crypto from "crypto";
import { Product } from "../models/Product.js";
import { productRepository } from "../repositories/productRepository.js";
import { AppError } from "../utils/AppError.js";

export class ProductService {
  async list(companyId, query = {}) {
    return productRepository.list(companyId, query);
  }

  async getById(id, companyId) {
    const product = await productRepository.findById(id);
    if (!product || product.companyId !== companyId) {
      throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
    }
    return product;
  }

  async create(data, companyId, createdBy) {
    const code = String(data.code || "").trim();
    const name = String(data.name || "").trim();
    const category = String(data.category || "").trim();
    const purchasePrice = Number(data.purchasePrice ?? 0);
    const salePrice = Number(data.salePrice ?? 0);
    const stock = Number(data.stock ?? 0);

    if (!code) {
      throw new AppError("El código es obligatorio", 422, "VALIDATION_ERROR");
    }
    if (!name) {
      throw new AppError("El nombre es obligatorio", 422, "VALIDATION_ERROR");
    }
    if (!category) {
      throw new AppError("La categoría es obligatoria", 422, "VALIDATION_ERROR");
    }
    if (purchasePrice <= 0 || salePrice <= 0) {
      throw new AppError("Los precios deben ser mayores a cero", 422, "VALIDATION_ERROR");
    }
    if (salePrice < purchasePrice) {
      throw new AppError("El precio de venta no puede ser menor al precio de compra", 422, "VALIDATION_ERROR");
    }
    if (stock < 0) {
      throw new AppError("El stock no puede ser negativo", 422, "VALIDATION_ERROR");
    }

    const existingCode = await productRepository.findByCode(code, companyId);
    if (existingCode) {
      throw new AppError("El código ya está registrado", 409, "DUPLICATE_PRODUCT_CODE");
    }

    const existingName = await productRepository.findByName(name, companyId);
    if (existingName) {
      throw new AppError("El nombre de producto ya existe", 409, "DUPLICATE_PRODUCT_NAME");
    }

    const product = new Product({
      id: crypto.randomUUID(),
      code,
      name,
      category,
      purchasePrice,
      salePrice,
      stock,
      stockThreshold: Number(data.stockThreshold ?? 10),
      companyId,
      createdBy,
      updatedBy: createdBy,
    });

    return productRepository.create(product);
  }

  async update(id, data, companyId, updatedBy) {
    const product = await this.getById(id, companyId);

    if (data.code && data.code.trim() !== product.code) {
      const existingCode = await productRepository.findByCode(data.code, companyId, id);
      if (existingCode) {
        throw new AppError("El código ya está registrado", 409, "DUPLICATE_PRODUCT_CODE");
      }
      product.code = data.code.trim();
    }

    if (data.name && data.name.trim() !== product.name) {
      const existingName = await productRepository.findByName(data.name, companyId, id);
      if (existingName) {
        throw new AppError("El nombre de producto ya existe", 409, "DUPLICATE_PRODUCT_NAME");
      }
      product.name = data.name.trim();
    }

    if (data.category) {
      product.category = String(data.category).trim();
    }

    if (data.purchasePrice !== undefined) {
      const purchasePrice = Number(data.purchasePrice);
      if (purchasePrice <= 0) {
        throw new AppError("El precio de compra debe ser mayor a cero", 422, "VALIDATION_ERROR");
      }
      product.purchasePrice = purchasePrice;
    }

    if (data.salePrice !== undefined) {
      const salePrice = Number(data.salePrice);
      if (salePrice <= 0) {
        throw new AppError("El precio de venta debe ser mayor a cero", 422, "VALIDATION_ERROR");
      }
      product.salePrice = salePrice;
    }

    if (product.salePrice < product.purchasePrice) {
      throw new AppError("El precio de venta no puede ser menor al precio de compra", 422, "VALIDATION_ERROR");
    }

    if (data.stock !== undefined) {
      const stock = Number(data.stock);
      if (stock < 0) {
        throw new AppError("El stock no puede ser negativo", 422, "VALIDATION_ERROR");
      }
      product.stock = stock;
    }

    if (data.stockThreshold !== undefined) {
      product.stockThreshold = Number(data.stockThreshold);
    }

    product.updatedBy = updatedBy;
    return productRepository.update(product);
  }

  async remove(id, companyId) {
    const product = await this.getById(id, companyId);
    return productRepository.remove(product.id, companyId);
  }
}

export const productService = new ProductService();
