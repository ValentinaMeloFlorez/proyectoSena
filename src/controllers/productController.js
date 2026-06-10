import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { productService } from "../services/productService.js";

export const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.list(req.user.companyId, {
    search: req.query.search,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  });
  return successResponse(res, { data: result });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id, req.user.companyId);
  return successResponse(res, { data: product.toJSON() });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body, req.user.companyId, req.user.id);
  return successResponse(res, {
    statusCode: 201,
    message: "Producto creado correctamente",
    data: product.toJSON(),
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body, req.user.companyId, req.user.id);
  return successResponse(res, { message: "Producto actualizado correctamente", data: product.toJSON() });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id, req.user.companyId);
  return successResponse(res, { message: "Producto eliminado correctamente" });
});
