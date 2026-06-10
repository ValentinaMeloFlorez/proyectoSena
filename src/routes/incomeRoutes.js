import { Router } from "express";
import { body, param, query } from "express-validator";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  listIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";

const router = Router();

const listIncomesValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número válido"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Límite debe ser un número válido"),
];

const incomeBodyValidator = [
  body("concept").notEmpty().withMessage("Concepto es obligatorio"),
  body("value").isFloat({ gt: 0 }).withMessage("Valor debe ser mayor a cero"),
  body("date").optional().isISO8601().withMessage("Fecha inválida"),
];

const incomeIdValidator = [param("id").isUUID().withMessage("ID de ingreso inválido")];

router.get(
  "/",
  ...guard.anyPermission(PERMISSIONS.INCOME_READ, PERMISSIONS.INCOME_WRITE),
  listIncomesValidator,
  validate,
  listIncomes
);
router.get("/:id", ...guard.anyPermission(PERMISSIONS.INCOME_READ, PERMISSIONS.INCOME_WRITE), incomeIdValidator, validate, getIncome);
router.post("/", ...guard.permission(PERMISSIONS.INCOME_WRITE), incomeBodyValidator, validate, createIncome);
router.put("/:id", ...guard.permission(PERMISSIONS.INCOME_WRITE), incomeIdValidator, validate, updateIncome);
router.delete("/:id", ...guard.permission(PERMISSIONS.INCOME_WRITE), incomeIdValidator, validate, deleteIncome);

export default router;
