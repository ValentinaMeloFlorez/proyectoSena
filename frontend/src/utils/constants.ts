export const APP_NAME = import.meta.env.VITE_APP_NAME || "CONTAIA PRO";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const PERMISSIONS = {
  USERS_MANAGE: "users:manage",
  ROLES_MANAGE: "roles:manage",
  CLIENTS_READ: "clients:read",
  CLIENTS_WRITE: "clients:write",
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
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
  { label: "Usuarios", path: "/users", icon: "Users", permission: PERMISSIONS.USERS_MANAGE },
  { label: "Productos", path: "/products", icon: "Package", permission: PERMISSIONS.PRODUCTS_READ },
  { label: "Inventario", path: "/inventory", icon: "Package", permission: PERMISSIONS.INVENTORY_READ },
  { label: "Facturación", path: "/invoicing", icon: "FileText", permission: PERMISSIONS.INVOICES_READ },
  { label: "Ingresos", path: "/income", icon: "FileText", permission: PERMISSIONS.INCOME_READ },
  { label: "Egresos", path: "/expenses", icon: "FileText", permission: PERMISSIONS.EXPENSES_READ },
  { label: "Reportes", path: "/reports", icon: "BarChart3", permission: PERMISSIONS.REPORTS_READ },
  { label: "IA", path: "/ai", icon: "Bot", permission: PERMISSIONS.AI_USE },
] as const;
