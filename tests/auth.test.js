/**
 * Pruebas del módulo de autenticación
 * Ejecutar: npm test
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import app from "../app.js";
import { userRepository } from "../src/repositories/userRepository.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

let server;
let baseUrl;

before(async () => {
  try { await fs.unlink(USERS_FILE); } catch { /* ok */ }
  await userRepository.seedIfEmpty();
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const post = async (url, body, headers = {}) => {
  const res = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data, headers: res.headers };
};

const get = async (url, headers = {}) => {
  const res = await fetch(`${baseUrl}${url}`, { headers });
  const data = await res.json();
  return { status: res.status, data };
};

describe("Módulo Autenticación", () => {
  let accessToken;

  it("POST /auth/login — credenciales válidas", async () => {
    const { status, data } = await post("/api/v1/auth/login", {
      email: "admin@contaia.com",
      password: "Admin123!",
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(data.data.accessToken);
    assert.equal(data.data.user.role, "Administrador");
    accessToken = data.data.accessToken;
  });

  it("POST /auth/login — credenciales inválidas", async () => {
    const { status, data } = await post("/api/v1/auth/login", {
      email: "admin@contaia.com",
      password: "wrong",
    });
    assert.equal(status, 401);
    assert.equal(data.success, false);
  });

  it("GET /auth/me — con token válido", async () => {
    const { status, data } = await get("/api/v1/auth/me", {
      Authorization: `Bearer ${accessToken}`,
    });
    assert.equal(status, 200);
    assert.equal(data.data.email, "admin@contaia.com");
  });

  it("GET /auth/me — sin token", async () => {
    const { status } = await get("/api/v1/auth/me");
    assert.equal(status, 401);
  });

  it("POST /auth/forgot-password — respuesta genérica", async () => {
    const { status, data } = await post("/api/v1/auth/forgot-password", {
      email: "admin@contaia.com",
    });
    assert.equal(status, 200);
    assert.ok(data.data.resetToken);
  });

  it("GET /protected/admin — solo Administrador", async () => {
    const { status, data } = await get("/api/v1/protected/admin", {
      Authorization: `Bearer ${accessToken}`,
    });
    assert.equal(status, 200);
    assert.equal(data.message, "Panel de administración");
  });

  it("POST /auth/logout", async () => {
    const { status, data } = await post("/api/v1/auth/logout", {});
    assert.equal(status, 200);
    assert.ok(data.message);
  });
});
