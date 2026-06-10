/**
 * Validaciones del módulo de roles
 */

import { body, param } from "express-validator";
import { ALL_PERMISSION_CODES } from "../config/permissions.js";

export const createRoleValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 }).withMessage("Entre 2 y 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Máximo 300 caracteres"),
  body("permissions")
    .isArray({ min: 1 }).withMessage("Debe incluir al menos un permiso")
    .custom((perms) => {
      const invalid = perms.filter((p) => !ALL_PERMISSION_CODES.includes(p));
      if (invalid.length > 0) throw new Error(`Permisos inválidos: ${invalid.join(", ")}`);
      return true;
    }),
];

export const updateRoleValidator = [
  param("id").isUUID().withMessage("ID de rol inválido"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Entre 2 y 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Máximo 300 caracteres"),
  body("permissions")
    .optional()
    .isArray({ min: 1 }).withMessage("Debe incluir al menos un permiso")
    .custom((perms) => {
      const invalid = perms.filter((p) => !ALL_PERMISSION_CODES.includes(p));
      if (invalid.length > 0) throw new Error(`Permisos inválidos: ${invalid.join(", ")}`);
      return true;
    }),
];

export const roleIdValidator = [
  param("id").isUUID().withMessage("ID de rol inválido"),
];
