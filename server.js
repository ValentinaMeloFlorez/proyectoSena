/**
 * CONTAIA PRO — Punto de entrada del servidor
 * Base de datos: JSON (archivos en /data)
 */

import app from "./app.js";
import { config } from "./src/config/index.js";
import { roleRepository } from "./src/repositories/roleRepository.js";
import { userRepository } from "./src/repositories/userRepository.js";

// Seed inicial — crea roles y usuarios si los archivos están vacíos
await roleRepository.seedSystemRoles();
await userRepository.seedIfEmpty();

const server = app.listen(config.port, () => {
  console.log("─────────────────────────────────────────");
  console.log(`  ${config.appName} v${config.appVersion}`);
  console.log(`  Entorno: ${config.nodeEnv}`);
  console.log(`  URL:     http://localhost:${config.port}`);
  console.log(`  Health:  http://localhost:${config.port}/api/v1/health`);
  console.log(`  Auth:    http://localhost:${config.port}/api/v1/auth/login`);
  console.log(`  Roles:   http://localhost:${config.port}/api/v1/roles`);
  console.log(`  Users:   http://localhost:${config.port}/api/v1/users`);
  console.log("─────────────────────────────────────────");
});

// Cierre graceful
const shutdown = (signal) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log("Servidor detenido correctamente.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
