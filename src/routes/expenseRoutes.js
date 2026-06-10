import { Router } from "express";
import { body, param, query } from "express-validator";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = Router();

const listExpensesValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número válido"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Límite debe ser un número válido"),
];

const expenseBodyValidator = [
  body("concept").notEmpty().withMessage("Concepto es obligatorio"),
  body("value").isFloat({ gt: 0 }).withMessage("Valor debe ser mayor a cero"),
  body("date").optional().isISO8601().withMessage("Fecha inválida"),
];

const expenseIdValidator = [param("id").isUUID().withMessage("ID de egreso inválido")];

router.get(
  "/",
  ...guard.anyPermission(PERMISSIONS.EXPENSES_READ, PERMISSIONS.EXPENSES_WRITE),
  listExpensesValidator,
  validate,
  listExpenses
);
router.get("/:id", ...guard.anyPermission(PERMISSIONS.EXPENSES_READ, PERMISSIONS.EXPENSES_WRITE), expenseIdValidator, validate, getExpense);
router.post("/", ...guard.permission(PERMISSIONS.EXPENSES_WRITE), expenseBodyValidator, validate, createExpense);
router.put("/:id", ...guard.permission(PERMISSIONS.EXPENSES_WRITE), expenseIdValidator, validate, updateExpense);
router.delete("/:id", ...guard.permission(PERMISSIONS.EXPENSES_WRITE), expenseIdValidator, validate, deleteExpense);

export default router;
