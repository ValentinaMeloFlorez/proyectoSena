/**
 * Controller — Roles HTTP
 */

import { roleService } from "../services/roleService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const listRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.listRoles(req.user.companyId);
  return successResponse(res, {
    data: roles.map((r) => r.toJSON()),
  });
});

export const getRole = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id, req.user.companyId);
  return successResponse(res, { data: role.toJSON() });
});

export const listPermissions = asyncHandler(async (req, res) => {
  const permissions = await roleService.listPermissions();
  return successResponse(res, { data: permissions });
});

export const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body, req.user.companyId, req.user.email);
  return successResponse(res, {
    statusCode: 201,
    message: "Rol creado correctamente",
    data: role.toJSON(),
  });
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body, req.user.companyId, req.user.email);
  return successResponse(res, {
    message: "Rol actualizado correctamente",
    data: role.toJSON(),
  });
});

export const deleteRole = asyncHandler(async (req, res) => {
  await roleService.deleteRole(req.params.id, req.user.companyId);
  return successResponse(res, { message: "Rol eliminado correctamente" });
});
