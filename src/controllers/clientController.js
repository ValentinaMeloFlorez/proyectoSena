import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { clientService } from "../services/clientService.js";

export const listClients = asyncHandler(async (req, res) => {
  const result = await clientService.list(req.user.companyId, {
    search: req.query.search,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  });
  return successResponse(res, { data: result });
});

export const getClient = asyncHandler(async (req, res) => {
  const client = await clientService.getById(req.params.id, req.user.companyId);
  return successResponse(res, { data: client.toJSON() });
});

export const createClient = asyncHandler(async (req, res) => {
  const client = await clientService.create(req.body, req.user.companyId, req.user.id);
  return successResponse(res, {
    statusCode: 201,
    message: "Cliente creado correctamente",
    data: client.toJSON(),
  });
});

export const updateClient = asyncHandler(async (req, res) => {
  const client = await clientService.update(req.params.id, req.body, req.user.companyId, req.user.id);
  return successResponse(res, { message: "Cliente actualizado correctamente", data: client.toJSON() });
});

export const deleteClient = asyncHandler(async (req, res) => {
  await clientService.remove(req.params.id, req.user.companyId);
  return successResponse(res, { message: "Cliente eliminado correctamente" });
});
