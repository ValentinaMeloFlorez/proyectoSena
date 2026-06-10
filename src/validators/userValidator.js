/**
 * Validaciones CRUD de usuarios
 */

import { body, param, query } from "express-validator";

export const listUsersValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página inválida"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Límite entre 1 y 100"),
  query("search").optional().trim().isLength({ max: 100 }),
];

export const createUserValidator = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 }).withMessage("Nombre entre 2 y 100 caracteres"),
  body("lastName")
    .trim()
    .notEmpty().withMessage("El apellido es requerido")
    .isLength({ min: 2, max: 100 }).withMessage("Apellido entre 2 y 100 caracteres"),
  body("document")
    .trim()
    .notEmpty().withMessage("El documento es requerido")
    .isLength({ min: 5, max: 20 }).withMessage("Documento entre 5 y 20 caracteres")
    .matches(/^[a-zA-Z0-9-]+$/).withMessage("Documento con caracteres inválidos"),
  body("email")
    .trim()
    .notEmpty().withMessage("El correo es requerido")
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("La contraseña es requerida")
    .isLength({ min: 8 }).withMessage("Mínimo 8 caracteres"),
  body("roleId")
    .notEmpty().withMessage("El rol es requerido")
    .isUUID().withMessage("Rol inválido"),
];

export const updateUserValidator = [
  param("id").isUUID().withMessage("ID inválido"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Nombre entre 2 y 100 caracteres"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Apellido entre 2 y 100 caracteres"),
  body("document")
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 }).withMessage("Documento entre 5 y 20 caracteres")
    .matches(/^[a-zA-Z0-9-]+$/).withMessage("Documento con caracteres inválidos"),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 8 }).withMessage("Mínimo 8 caracteres"),
  body("roleId")
    .optional()
    .isUUID().withMessage("Rol inválido"),
];

export const userIdValidator = [
  param("id").isUUID().withMessage("ID inválido"),
];
