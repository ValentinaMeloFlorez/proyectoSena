/**
 * Middleware de manejo de errores global
 */

import { AppError } from "../utils/AppError.js";

/**
 * Ruta no encontrada — 404
 */
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
};

/**
 * Manejador global de errores
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Error interno del servidor";

  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${code}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    code,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === "development" && err.stack ? { stack: err.stack } : {}),
  });
};
