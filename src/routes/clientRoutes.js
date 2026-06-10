import { Router } from "express";
import { body, param, query } from "express-validator";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = Router();

const listClientsValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número válido"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Límite debe ser un número válido"),
];

const clientBodyValidator = [
  body("name").notEmpty().withMessage("Nombre es obligatorio"),
  body("document").notEmpty().withMessage("Documento es obligatorio"),
];

const clientIdValidator = [param("id").isUUID().withMessage("ID de cliente inválido")];

router.get(
  "/",
  ...guard.anyPermission(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_WRITE),
  listClientsValidator,
  validate,
  listClients
);
router.get("/:id", ...guard.anyPermission(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_WRITE), clientIdValidator, validate, getClient);
router.post("/", ...guard.permission(PERMISSIONS.CLIENTS_WRITE), clientBodyValidator, validate, createClient);
router.put("/:id", ...guard.permission(PERMISSIONS.CLIENTS_WRITE), clientIdValidator, validate, updateClient);
router.delete("/:id", ...guard.permission(PERMISSIONS.CLIENTS_WRITE), clientIdValidator, validate, deleteClient);

export default router;
