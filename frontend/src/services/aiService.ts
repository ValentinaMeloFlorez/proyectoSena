import { post } from "@/services/api";
import type {
  AIPredictionRequest,
  AIPredictionResponse,
  AIAnomalyResponse,
  AIRecommendationResponse,
  AISmartAlertResponse,
} from "@/types/erp";

const BASE = "/ai";

export async function predictSales(data: AIPredictionRequest) {
  const response = await post<AIPredictionResponse>(`${BASE}/predict/sales`, data);
  return response.data;
}

export async function predictExpenses(data: AIPredictionRequest) {
  const response = await post<AIPredictionResponse>(`${BASE}/predict/expenses`, data);
  return response.data;
}

export async function detectAnomalies(data: { records: Array<{ date?: string; value: number }> }) {
  const response = await post<AIAnomalyResponse>(`${BASE}/detect/anomalies`, data);
  return response.data;
}

export async function fetchRecommendations(data: { context?: Record<string, unknown> }) {
  const response = await post<AIRecommendationResponse>(`${BASE}/recommendations/financial`, data);
  return response.data;
}

export async function fetchSmartAlerts(data: { metrics?: Record<string, unknown> }) {
  const response = await post<AISmartAlertResponse>(`${BASE}/alerts/intelligent`, data);
  return response.data;
}
