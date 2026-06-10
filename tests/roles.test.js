/**
 * Pruebas del módulo de roles
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import app from "../app.js";
import { roleRepository } from "../src/repositories/roleRepository.js";
import { userRepository } from "../src/repositories/userRepository.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");

let server;
let baseUrl;
let adminToken;
let empleadoToken;

before(async () => {
  for (const file of ["users.json", "roles.json"]) {
    try { await fs.unlink(path.join(DATA_DIR, file)); } catch { /* ok */ }
  }
  await roleRepository.seedSystemRoles();
  await userRepository.seedIfEmpty();

  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;

  const loginAdmin = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@contaia.com", password: "Admin123!" }),
  });
  adminToken = (await loginAdmin.json()).data.accessToken;

  const loginEmp = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "empleado@contaia.com", password: "Empleado123!" }),
  });
  empleadoToken = (await loginEmp.json()).data.accessToken;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("Módulo Roles", () => {
  it("GET /roles/permissions — admin puede ver catálogo", async () => {
    const res = await fetch(`${baseUrl}/api/v1/roles/permissions`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.data.length > 0);
    assert.ok(data.data.some((p) => p.code === "roles:manage"));
  });

  it("GET /roles — admin lista roles del sistema", async () => {
    const res = await fetch(`${baseUrl}/api/v1/roles`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.data.length, 4);
  });

  it("GET /roles — empleado sin permiso recibe 403", async () => {
    const res = await fetch(`${baseUrl}/api/v1/roles`, {
      headers: { Authorization: `Bearer ${empleadoToken}` },
    });
    assert.equal(res.status, 403);
  });

  it("POST /roles — crear rol personalizado", async () => {
    const res = await fetch(`${baseUrl}/api/v1/roles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Supervisor",
        description: "Supervisor de ventas",
        permissions: ["dashboard:read", "clients:read", "invoices:read"],
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.data.name, "Supervisor");
  });

  it("DELETE /roles — no eliminar rol del sistema", async () => {
    const listRes = await fetch(`${baseUrl}/api/v1/roles`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const roles = (await listRes.json()).data;
    const adminRole = roles.find((r) => r.name === "Administrador");

    const res = await fetch(`${baseUrl}/api/v1/roles/${adminRole.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 403);
  });
});
