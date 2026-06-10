/**
 * Rutas de ejemplo — demuestra protección con guard
 */

import { Router } from "express";
import { guard } from "../middleware/routeGuard.js";
import { ROLES, PERMISSIONS } from "../config/roles.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get(
  "/admin",
  ...guard.role(ROLES.ADMINISTRADOR),
  asyncHandler(async (req, res) => {
    return successResponse(res, {
      message: "Panel de administración",
      data: { user: req.user },
    });
  })
);

router.get(
  "/accounting",
  ...guard.anyPermission(PERMISSIONS.INCOME_READ, PERMISSIONS.EXPENSES_READ),
  asyncHandler(async (req, res) => {
    return successResponse(res, {
      message: "Módulo contable",
      data: { role: req.user.role },
    });
  })
);

router.get(
  "/reports",
  ...guard.permission(PERMISSIONS.REPORTS_READ),
  asyncHandler(async (req, res) => {
    return successResponse(res, {
      message: "Acceso a reportes autorizado",
      data: { permissions: req.user.permissions },
    });
  })
);

export default router;
