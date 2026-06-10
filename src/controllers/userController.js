/**
 * Controller — CRUD de usuarios
 */

import { userService } from "../services/userService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;
  const result = await userService.list(req.user.companyId, {
    search,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 20,
  });

  return successResponse(res, {
    data: {
      items: result.items.map((u) => u.toJSON()),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id, req.user.companyId);
  return successResponse(res, { data: user.toJSON() });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body, req.user.companyId, req.user.email);
  return successResponse(res, {
    statusCode: 201,
    message: "Usuario creado correctamente",
    data: user.toJSON(),
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.update(
    req.params.id,
    req.body,
    req.user.companyId,
    req.user.email,
    req.user.id
  );
  return successResponse(res, {
    message: "Usuario actualizado correctamente",
    data: user.toJSON(),
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id, req.user.companyId, req.user.id);
  return successResponse(res, { message: "Usuario eliminado correctamente" });
});
