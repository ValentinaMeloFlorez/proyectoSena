import { aiService } from "../services/aiService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const predictSales = asyncHandler(async (req, res) => {
  const result = await aiService.predictSales(req.body);
  return successResponse(res, {
    message: "Predicción de ventas generada",
    data: result,
  });
});

export const predictExpenses = asyncHandler(async (req, res) => {
  const result = await aiService.predictExpenses(req.body);
  return successResponse(res, {
    message: "Predicción de gastos generada",
    data: result,
  });
});

export const detectAnomalies = asyncHandler(async (req, res) => {
  const result = await aiService.detectAnomalies(req.body);
  return successResponse(res, {
    message: "Anomalías detectadas",
    data: result,
  });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const result = await aiService.getRecommendations(req.body);
  return successResponse(res, {
    message: "Recomendaciones financieras generadas",
    data: result,
  });
});

export const getAlerts = asyncHandler(async (req, res) => {
  const result = await aiService.getAlerts(req.body);
  return successResponse(res, {
    message: "Alertas inteligentes generadas",
    data: result,
  });
});
