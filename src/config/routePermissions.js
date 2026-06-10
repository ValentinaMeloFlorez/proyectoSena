/**
 * Mapa de protección de rutas — método + ruta → permiso requerido
 * Usado por routeGuard middleware
 */

import { PERMISSIONS } from "./permissions.js";

/**
 * @type {Array<{ method: string, pattern: RegExp, permission: string }>}
 */
export const ROUTE_PERMISSION_MAP = [
  // Roles
  { method: "GET", pattern: /^\/roles\/?$/, permission: PERMISSIONS.ROLES_MANAGE },
  { method: "GET", pattern: /^\/roles\/permissions\/?$/, permission: PERMISSIONS.ROLES_MANAGE },
  { method: "GET", pattern: /^\/roles\/[^/]+$/, permission: PERMISSIONS.ROLES_MANAGE },
  { method: "POST", pattern: /^\/roles\/?$/, permission: PERMISSIONS.ROLES_MANAGE },
  { method: "PUT", pattern: /^\/roles\/[^/]+$/, permission: PERMISSIONS.ROLES_MANAGE },
  { method: "DELETE", pattern: /^\/roles\/[^/]+$/, permission: PERMISSIONS.ROLES_MANAGE },

  // Usuarios
  { method: "GET", pattern: /^\/users\/?$/, permission: PERMISSIONS.USERS_MANAGE },
  { method: "GET", pattern: /^\/users\/[^/]+$/, permission: PERMISSIONS.USERS_MANAGE },
  { method: "POST", pattern: /^\/users\/?$/, permission: PERMISSIONS.USERS_MANAGE },
  { method: "PUT", pattern: /^\/users\/[^/]+$/, permission: PERMISSIONS.USERS_MANAGE },
  { method: "DELETE", pattern: /^\/users\/[^/]+$/, permission: PERMISSIONS.USERS_MANAGE },

  // Productos
  { method: "GET", pattern: /^\/products\/?$/, permission: PERMISSIONS.PRODUCTS_READ },
  { method: "GET", pattern: /^\/products\/[^/]+$/, permission: PERMISSIONS.PRODUCTS_READ },
  { method: "POST", pattern: /^\/products\/?$/, permission: PERMISSIONS.PRODUCTS_WRITE },
  { method: "PUT", pattern: /^\/products\/[^/]+$/, permission: PERMISSIONS.PRODUCTS_WRITE },
  { method: "DELETE", pattern: /^\/products\/[^/]+$/, permission: PERMISSIONS.PRODUCTS_WRITE },

  // Clientes
  { method: "GET", pattern: /^\/clients\/?$/, permission: PERMISSIONS.CLIENTS_READ },
  { method: "GET", pattern: /^\/clients\/[^/]+$/, permission: PERMISSIONS.CLIENTS_READ },
  { method: "POST", pattern: /^\/clients\/?$/, permission: PERMISSIONS.CLIENTS_WRITE },
  { method: "PUT", pattern: /^\/clients\/[^/]+$/, permission: PERMISSIONS.CLIENTS_WRITE },
  { method: "DELETE", pattern: /^\/clients\/[^/]+$/, permission: PERMISSIONS.CLIENTS_WRITE },

  // Inventario
  { method: "GET", pattern: /^\/inventory\/?$/, permission: PERMISSIONS.INVENTORY_READ },
  { method: "POST", pattern: /^\/inventory\/?$/, permission: PERMISSIONS.INVENTORY_WRITE },

  // Facturación
  { method: "GET", pattern: /^\/invoices\/?$/, permission: PERMISSIONS.INVOICES_READ },
  { method: "GET", pattern: /^\/invoices\/[^/]+$/, permission: PERMISSIONS.INVOICES_READ },
  { method: "POST", pattern: /^\/invoices\/?$/, permission: PERMISSIONS.INVOICES_WRITE },

  // Ingresos
  { method: "GET", pattern: /^\/income\/?$/, permission: PERMISSIONS.INCOME_READ },
  { method: "GET", pattern: /^\/income\/[^/]+$/, permission: PERMISSIONS.INCOME_READ },
  { method: "POST", pattern: /^\/income\/?$/, permission: PERMISSIONS.INCOME_WRITE },
  { method: "PUT", pattern: /^\/income\/[^/]+$/, permission: PERMISSIONS.INCOME_WRITE },
  { method: "DELETE", pattern: /^\/income\/[^/]+$/, permission: PERMISSIONS.INCOME_WRITE },

  // Egresos
  { method: "GET", pattern: /^\/expenses\/?$/, permission: PERMISSIONS.EXPENSES_READ },
  { method: "GET", pattern: /^\/expenses\/[^/]+$/, permission: PERMISSIONS.EXPENSES_READ },
  { method: "POST", pattern: /^\/expenses\/?$/, permission: PERMISSIONS.EXPENSES_WRITE },
  { method: "PUT", pattern: /^\/expenses\/[^/]+$/, permission: PERMISSIONS.EXPENSES_WRITE },
  { method: "DELETE", pattern: /^\/expenses\/[^/]+$/, permission: PERMISSIONS.EXPENSES_WRITE },

  // Dashboard
  { method: "GET", pattern: /^\/dashboard\/?$/, permission: PERMISSIONS.DASHBOARD_READ },

  // Reportes
  { method: "GET", pattern: /^\/reports\/sales\/?$/, permission: PERMISSIONS.REPORTS_READ },
  { method: "GET", pattern: /^\/reports\/inventory\/?$/, permission: PERMISSIONS.REPORTS_READ },
  { method: "GET", pattern: /^\/reports\/clients\/?$/, permission: PERMISSIONS.REPORTS_READ },
  { method: "GET", pattern: /^\/reports\/financial\/?$/, permission: PERMISSIONS.REPORTS_READ },

  // Inteligencia Artificial
  { method: "POST", pattern: /^\/ai\/predict\/sales\/?$/, permission: PERMISSIONS.AI_USE },
  { method: "POST", pattern: /^\/ai\/predict\/expenses\/?$/, permission: PERMISSIONS.AI_USE },
  { method: "POST", pattern: /^\/ai\/detect\/anomalies\/?$/, permission: PERMISSIONS.AI_USE },
  { method: "POST", pattern: /^\/ai\/recommendations\/financial\/?$/, permission: PERMISSIONS.AI_USE },
  { method: "POST", pattern: /^\/ai\/alerts\/intelligent\/?$/, permission: PERMISSIONS.AI_USE },

  // Ejemplos futuros
  // { method: "GET", pattern: /^\/clients\/?$/, permission: PERMISSIONS.CLIENTS_READ },
  // { method: "POST", pattern: /^\/clients\/?$/, permission: PERMISSIONS.CLIENTS_WRITE },
];

/**
 * Busca el permiso requerido para una ruta relativa a /api/v1
 */
export const findRoutePermission = (method, path) => {
  const normalized = path.replace(/^\/api\/v1/, "") || "/";
  const match = ROUTE_PERMISSION_MAP.find(
    (entry) => entry.method === method.toUpperCase() && entry.pattern.test(normalized)
  );
  return match?.permission || null;
};
