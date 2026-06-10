import { Router } from "express";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { getDashboardMetrics } from "../controllers/dashboardController.js";

const router = Router();

router.get("/", ...guard.permission(PERMISSIONS.DASHBOARD_READ), getDashboardMetrics);

export default router;
