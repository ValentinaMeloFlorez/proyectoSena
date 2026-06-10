/**
 * Configuración centralizada — carga variables de entorno
 */

import dotenv from "dotenv";

dotenv.config();

const parseCorsOrigins = (value) => {
  if (!value) return ["http://localhost:5173"];
  return value.split(",").map((origin) => origin.trim()).filter(Boolean);
};

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  appName: process.env.APP_NAME || "CONTAIA PRO",
  appVersion: process.env.APP_VERSION || "1.0.0",
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  jwtResetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || "15m",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:5001",
  logLevel: process.env.LOG_LEVEL || "info",
  isProduction: process.env.NODE_ENV === "production",
  // MySQL
  mysqlHost: process.env.MYSQL_HOST || "localhost",
  mysqlPort: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  mysqlUser: process.env.MYSQL_USER || "root",
  mysqlPassword: process.env.MYSQL_PASSWORD || "",
  mysqlDatabase: process.env.MYSQL_DATABASE || "bsproyecto",
};
