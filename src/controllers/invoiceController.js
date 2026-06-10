import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { invoiceService } from "../services/invoiceService.js";

export const listInvoices = asyncHandler(async (req, res) => {
  const result = await invoiceService.list(req.user.companyId, {
    search: req.query.search,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  });
  return successResponse(res, { data: result });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getById(req.params.id, req.user.companyId);
  return successResponse(res, { data: invoice.toJSON() });
});

export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.create(req.body, req.user.companyId, req.user.id);
  return successResponse(res, {
    statusCode: 201,
    message: "Factura generada correctamente",
    data: invoice.toJSON(),
  });
});
