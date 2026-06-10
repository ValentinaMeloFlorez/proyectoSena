import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { inventoryService } from "../services/inventoryService.js";

export const listInventory = asyncHandler(async (req, res) => {
  const result = await inventoryService.list(req.user.companyId, {
    productId: req.query.productId,
    type: req.query.type,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  });
  return successResponse(res, { data: result });
});

export const createInventoryMovement = asyncHandler(async (req, res) => {
  const movement = await inventoryService.createMovement(req.body, req.user.companyId, req.user.id);
  return successResponse(res, {
    statusCode: 201,
    message: "Movimiento registrado correctamente",
    data: movement.toJSON(),
  });
});
