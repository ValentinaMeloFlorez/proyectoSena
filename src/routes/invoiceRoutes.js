import { Router } from "express";
import { body, param, query } from "express-validator";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  listInvoices,
  getInvoice,
  createInvoice,
} from "../controllers/invoiceController.js";

const router = Router();

const listInvoicesValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número válido"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Límite debe ser un número válido"),
];

const invoiceBodyValidator = [
  body("clientId").isUUID().withMessage("Cliente inválido"),
  body("items").isArray({ min: 1 }).withMessage("La factura debe incluir al menos un producto"),
  body("items.*.productId").isUUID().withMessage("Producto inválido"),
  body("items.*.quantity").isFloat({ gt: 0 }).withMessage("Cantidad debe ser mayor a cero"),
];

const invoiceIdValidator = [param("id").isUUID().withMessage("ID de factura inválido")];

router.get(
  "/",
  ...guard.anyPermission(PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_WRITE),
  listInvoicesValidator,
  validate,
  listInvoices
);
router.get("/:id", ...guard.anyPermission(PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_WRITE), invoiceIdValidator, validate, getInvoice);
router.post("/", ...guard.permission(PERMISSIONS.INVOICES_WRITE), invoiceBodyValidator, validate, createInvoice);

export default router;
