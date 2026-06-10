/**
 * CONTAIA PRO — Configuración principal de Express
 * Responsabilidad: crear y configurar la aplicación (sin levantar el servidor)
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { config } from "./src/config/index.js";
import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";
import routes from "./src/routes/index.js";

const app = express();

// ─── Seguridad ───────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Parsers ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging HTTP ────────────────────────────────────────────────────────────
if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
}

// ─── Rutas ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    app: config.appName,
    version: config.appVersion,
    environment: config.nodeEnv,
    docs: "/api/v1/health",
  });
});

app.use("/api/v1", routes);

// ─── Manejo de errores (siempre al final) ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
