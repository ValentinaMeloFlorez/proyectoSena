import { AppError } from "../utils/AppError.js";
import { config } from "../config/index.js";

const normalizeJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new AppError("Respuesta no válida del servicio IA", 502, "AI_SERVICE_ERROR");
  }
};

export class AIService {
  constructor() {
    this.baseUrl = config.aiServiceUrl;
  }

  async request(path, payload) {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });

    const json = await normalizeJson(response);
    if (!response.ok || json.success === false) {
      const message = json.message || "Error en la integración con el servicio IA";
      throw new AppError(message, response.status || 502, "AI_SERVICE_ERROR", json);
    }
    return json.data || json;
  }

  async predictSales(payload) {
    return this.request("/predict/sales", payload);
  }

  async predictExpenses(payload) {
    return this.request("/predict/expenses", payload);
  }

  async detectAnomalies(payload) {
    return this.request("/detect/anomalies", payload);
  }

  async getRecommendations(payload) {
    return this.request("/recommendations/financial", payload);
  }

  async getAlerts(payload) {
    return this.request("/alerts/intelligent", payload);
  }
}

export const aiService = new AIService();
