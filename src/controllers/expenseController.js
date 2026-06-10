import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { expenseService } from "../services/expenseService.js";

export const listExpenses = asyncHandler(async (req, res) => {
  const result = await expenseService.list(req.user.companyId, {
    search: req.query.search,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  });
  return successResponse(res, { data: result });
});

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getById(req.params.id, req.user.companyId);
  return successResponse(res, { data: expense.toJSON() });
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.create(req.body, req.user.companyId, req.user.id);
  return successResponse(res, {
    statusCode: 201,
    message: "Egreso registrado correctamente",
    data: expense.toJSON(),
  });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.update(req.params.id, req.body, req.user.companyId, req.user.id);
  return successResponse(res, { message: "Egreso actualizado correctamente", data: expense.toJSON() });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.remove(req.params.id, req.user.companyId);
  return successResponse(res, { message: "Egreso eliminado correctamente" });
});
