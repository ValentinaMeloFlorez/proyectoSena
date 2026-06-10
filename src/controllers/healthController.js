/**
 * Controller — Maneja requests HTTP del módulo Health
 * No contiene lógica de negocio (delega al Service)
 */
import { healthService } from "../services/healthService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getHealth = asyncHandler(async (req, res) => {
  const data = healthService.getStatus();
  return successResponse(res, { message: "Sistema operativo", data });
});
