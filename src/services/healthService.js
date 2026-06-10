/**
 * Service — Lógica de negocio del health check
 */
import { config } from "../config/index.js";

export class HealthService {
  getStatus() {
    return {
      status: "healthy",
      appName: config.appName,
      version: config.appVersion,
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

export const healthService = new HealthService();
