import { Router } from "express";
import { body, query } from "express-validator";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import { listInventory, createInventoryMovement } from "../controllers/inventoryController.js";

const router = Router();

const listInventoryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número válido"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Límite debe ser un número válido"),
  query("type").optional().isIn(["entry", "exit", "adjustment"]).withMessage("Tipo de movimiento inválido"),
];

const movementValidator = [
  body("productId").isUUID().withMessage("Producto inválido"),
  body("type").isIn(["entry", "exit", "adjustment"]).withMessage("Tipo de movimiento inválido"),
  body("reason").optional().isString().withMessage("Motivo inválido"),
  body("quantity").optional().isFloat({ gt: 0 }).withMessage("Cantidad debe ser mayor a cero"),
  body("newStock").optional().isFloat({ min: 0 }).withMessage("Stock ajustado debe ser no negativo"),
];

router.get(
  "/",
  ...guard.anyPermission(PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_WRITE),
  listInventoryValidator,
  validate,
  listInventory
);
router.post("/", ...guard.permission(PERMISSIONS.INVENTORY_WRITE), movementValidator, validate, createInventoryMovement);

export default router;
