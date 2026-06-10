/**
 * Rutas de autenticación
 */

import { Router } from "express";
import {
  login,
  logout,
  refresh,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validators/authValidator.js";

const router = Router();

// Públicas
router.post("/login", loginValidator, validate, login);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.post("/refresh", refresh);

// Logout no requiere access token válido — solo invalida refresh cookie
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, changePasswordValidator, validate, changePassword);

export default router;
