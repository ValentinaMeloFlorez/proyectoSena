/**
 * Validaciones de entrada — express-validator
 */

import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("El email es requerido")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("La contraseña es requerida")
    .isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("El email es requerido")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token")
    .notEmpty().withMessage("El token es requerido"),
  body("newPassword")
    .notEmpty().withMessage("La nueva contraseña es requerida")
    .isLength({ min: 8 }).withMessage("Mínimo 8 caracteres"),
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty().withMessage("La contraseña actual es requerida"),
  body("newPassword")
    .notEmpty().withMessage("La nueva contraseña es requerida")
    .isLength({ min: 8 }).withMessage("Mínimo 8 caracteres")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("La nueva contraseña debe ser diferente a la actual");
      }
      return true;
    }),
];
