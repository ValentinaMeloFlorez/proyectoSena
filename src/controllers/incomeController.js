import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { incomeService } from "../services/incomeService.js";

export const listIncomes = asyncHandler(async (req, res) => {
  const result = await incomeService.list(req.user.companyId, {
    search: req.query.search,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  });
  return successResponse(res, { data: result });
});

export const getIncome = asyncHandler(async (req, res) => {
  const income = await incomeService.getById(req.params.id, req.user.companyId);
  return successResponse(res, { data: income.toJSON() });
});

export const createIncome = asyncHandler(async (req, res) => {
  const income = await incomeService.create(req.body, req.user.companyId, req.user.id);
  return successResponse(res, {
    statusCode: 201,
    message: "Ingreso registrado correctamente",
    data: income.toJSON(),
  });
});

export const updateIncome = asyncHandler(async (req, res) => {
  const income = await incomeService.update(req.params.id, req.body, req.user.companyId, req.user.id);
  return successResponse(res, { message: "Ingreso actualizado correctamente", data: income.toJSON() });
});

export const deleteIncome = asyncHandler(async (req, res) => {
  await incomeService.remove(req.params.id, req.user.companyId);
  return successResponse(res, { message: "Ingreso eliminado correctamente" });
});
