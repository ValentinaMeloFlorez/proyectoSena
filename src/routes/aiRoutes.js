import { Router } from "express";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  aiAlertsValidator,
  aiAnomalyValidator,
  aiContextValidator,
  aiPredictionValidator,
} from "../validators/aiValidator.js";
import {
  getAlerts,
  getRecommendations,
  detectAnomalies,
  predictExpenses,
  predictSales,
} from "../controllers/aiController.js";

const router = Router();
router.use(...guard.permission(PERMISSIONS.AI_USE));

router.post("/predict/sales", aiPredictionValidator, validate, predictSales);
router.post("/predict/expenses", aiPredictionValidator, validate, predictExpenses);
router.post("/detect/anomalies", aiAnomalyValidator, validate, detectAnomalies);
router.post("/recommendations/financial", aiContextValidator, validate, getRecommendations);
router.post("/alerts/intelligent", aiAlertsValidator, validate, getAlerts);

export default router;
