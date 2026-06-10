/**
 * Pruebas CRUD de usuarios
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

let server, baseUrl, adminToken, roleId;

before(async () => {
  for (const f of ["users.json", "roles.json"]) {
    try { await fs.unlink(path.join(DATA_DIR, f)); } catch { /* ok */ }
  }
  await roleRepository.seedSystemRoles();
  await userRepository.seedIfEmpty();

  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const login = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@contaia.com", password: "Admin123!" }),
  });
  adminToken = (await login.json()).data.accessToken;

  const rolesRes = await fetch(`${baseUrl}/api/v1/roles`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  roleId = (await rolesRes.json()).data.find((r) => r.name === "Empleado").id;
});

after(async () => {
  await new Promise((r) => server.close(r));
});

describe("CRUD Usuarios", () => {
  let userId;

  it("POST /users — crear usuario", async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: "Pedro",
        lastName: "García",
        document: "1099999999",
        email: "pedro@test.com",
        password: "Pedro123!",
        roleId,
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.data.firstName, "Pedro");
    userId = data.data.id;
  });

  it("GET /users — listar", async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.data.items.length >= 5);
  });

  it("PUT /users/:id — actualizar", async () => {
    const res = await fetch(`${baseUrl}/api/v1/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName: "Pedro Luis" }),
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.data.firstName, "Pedro Luis");
  });

  it("DELETE /users/:id — eliminar", async () => {
    const res = await fetch(`${baseUrl}/api/v1/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
  });
});
