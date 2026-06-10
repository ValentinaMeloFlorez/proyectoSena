/**
 * Catálogo completo de permisos del sistema
 */

export const PERMISSIONS = {
  DASHBOARD_READ: "dashboard:read",
  USERS_MANAGE: "users:manage",
  ROLES_MANAGE: "roles:manage",
  CLIENTS_READ: "clients:read",
  CLIENTS_WRITE: "clients:write",
  SUPPLIERS_READ: "suppliers:read",
  SUPPLIERS_WRITE: "suppliers:write",
  PRODUCTS_READ: "products:read",
  PRODUCTS_WRITE: "products:write",
  INVENTORY_READ: "inventory:read",
  INVENTORY_WRITE: "inventory:write",
  INVOICES_READ: "invoices:read",
  INVOICES_WRITE: "invoices:write",
  INCOME_READ: "income:read",
  INCOME_WRITE: "income:write",
  EXPENSES_READ: "expenses:read",
  EXPENSES_WRITE: "expenses:write",
  REPORTS_READ: "reports:read",
  REPORTS_EXPORT: "reports:export",
  AI_USE: "ai:use",
};

export const PERMISSION_CATALOG = [
  { code: PERMISSIONS.DASHBOARD_READ, resource: "dashboard", action: "read", module: "Dashboard", description: "Ver panel principal" },
  { code: PERMISSIONS.USERS_MANAGE, resource: "users", action: "manage", module: "Usuarios", description: "Gestionar usuarios" },
  { code: PERMISSIONS.ROLES_MANAGE, resource: "roles", action: "manage", module: "Roles", description: "Gestionar roles y permisos" },
  { code: PERMISSIONS.CLIENTS_READ, resource: "clients", action: "read", module: "Clientes", description: "Ver clientes" },
  { code: PERMISSIONS.CLIENTS_WRITE, resource: "clients", action: "write", module: "Clientes", description: "Crear y editar clientes" },
  { code: PERMISSIONS.SUPPLIERS_READ, resource: "suppliers", action: "read", module: "Proveedores", description: "Ver proveedores" },
  { code: PERMISSIONS.SUPPLIERS_WRITE, resource: "suppliers", action: "write", module: "Proveedores", description: "Crear y editar proveedores" },
  { code: PERMISSIONS.PRODUCTS_READ, resource: "products", action: "read", module: "Productos", description: "Ver productos" },
  { code: PERMISSIONS.PRODUCTS_WRITE, resource: "products", action: "write", module: "Productos", description: "Crear y editar productos" },
  { code: PERMISSIONS.INVENTORY_READ, resource: "inventory", action: "read", module: "Inventario", description: "Ver inventario" },
  { code: PERMISSIONS.INVENTORY_WRITE, resource: "inventory", action: "write", module: "Inventario", description: "Registrar movimientos" },
  { code: PERMISSIONS.INVOICES_READ, resource: "invoices", action: "read", module: "Facturación", description: "Ver facturas" },
  { code: PERMISSIONS.INVOICES_WRITE, resource: "invoices", action: "write", module: "Facturación", description: "Crear y editar facturas" },
  { code: PERMISSIONS.INCOME_READ, resource: "income", action: "read", module: "Ingresos", description: "Ver ingresos" },
  { code: PERMISSIONS.INCOME_WRITE, resource: "income", action: "write", module: "Ingresos", description: "Registrar ingresos" },
  { code: PERMISSIONS.EXPENSES_READ, resource: "expenses", action: "read", module: "Egresos", description: "Ver egresos" },
  { code: PERMISSIONS.EXPENSES_WRITE, resource: "expenses", action: "write", module: "Egresos", description: "Registrar egresos" },
  { code: PERMISSIONS.REPORTS_READ, resource: "reports", action: "read", module: "Reportes", description: "Ver reportes" },
  { code: PERMISSIONS.REPORTS_EXPORT, resource: "reports", action: "export", module: "Reportes", description: "Exportar reportes" },
  { code: PERMISSIONS.AI_USE, resource: "ai", action: "use", module: "IA", description: "Usar asistente IA" },
];

export const ALL_PERMISSION_CODES = PERMISSION_CATALOG.map((p) => p.code);

export const isValidPermission = (code) => ALL_PERMISSION_CODES.includes(code);

export const getPermissionMeta = (code) => PERMISSION_CATALOG.find((p) => p.code === code);
