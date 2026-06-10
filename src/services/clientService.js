import crypto from "crypto";
import { Client } from "../models/Client.js";
import { clientRepository } from "../repositories/clientRepository.js";
import { AppError } from "../utils/AppError.js";

export class ClientService {
  async list(companyId, query = {}) {
    return clientRepository.list(companyId, query);
  }

  async getById(id, companyId) {
    const client = await clientRepository.findById(id);
    if (!client || client.companyId !== companyId) {
      throw new AppError("Cliente no encontrado", 404, "CLIENT_NOT_FOUND");
    }
    return client;
  }

  async create(data, companyId, createdBy) {
    const name = String(data.name || "").trim();
    const document = String(data.document || "").trim();
    if (!name) {
      throw new AppError("El nombre del cliente es obligatorio", 422, "VALIDATION_ERROR");
    }
    if (!document) {
      throw new AppError("El documento del cliente es obligatorio", 422, "VALIDATION_ERROR");
    }

    const existingDoc = await clientRepository.findByDocument(document, companyId);
    if (existingDoc) {
      throw new AppError("El documento ya está registrado", 409, "DUPLICATE_CLIENT_DOCUMENT");
    }

    const client = new Client({
      id: crypto.randomUUID(),
      name,
      document,
      email: String(data.email || "").trim(),
      phone: String(data.phone || "").trim(),
      address: String(data.address || "").trim(),
      companyId,
      createdBy,
      updatedBy: createdBy,
    });

    return clientRepository.create(client);
  }

  async update(id, data, companyId, updatedBy) {
    const client = await this.getById(id, companyId);

    if (data.document && data.document.trim() !== client.document) {
      const existingDoc = await clientRepository.findByDocument(data.document, companyId, id);
      if (existingDoc) {
        throw new AppError("El documento ya está registrado", 409, "DUPLICATE_CLIENT_DOCUMENT");
      }
      client.document = data.document.trim();
    }

    if (data.name) client.name = String(data.name).trim();
    if (data.email !== undefined) client.email = String(data.email).trim();
    if (data.phone !== undefined) client.phone = String(data.phone).trim();
    if (data.address !== undefined) client.address = String(data.address).trim();

    client.updatedBy = updatedBy;
    return clientRepository.update(client);
  }

  async remove(id, companyId) {
    await this.getById(id, companyId);
    return clientRepository.remove(id, companyId);
  }
}

export const clientService = new ClientService();
