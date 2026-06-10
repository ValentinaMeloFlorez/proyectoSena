import { Router } from "express";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import {
  generateSalesReport,
  generateInventoryReport,
  generateClientsReport,
  generateFinancialReport,
} from "../controllers/reportController.js";

const router = Router();

router.get("/sales", ...guard.anyPermission(PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_EXPORT), generateSalesReport);
router.get("/inventory", ...guard.anyPermission(PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_EXPORT), generateInventoryReport);
router.get("/clients", ...guard.anyPermission(PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_EXPORT), generateClientsReport);
router.get("/financial", ...guard.anyPermission(PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_EXPORT), generateFinancialReport);

export default router;
