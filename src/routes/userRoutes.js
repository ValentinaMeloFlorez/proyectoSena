/**
 * Rutas CRUD de usuarios
 */

import { Router } from "express";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  listUsersValidator,
  createUserValidator,
  updateUserValidator,
  userIdValidator,
} from "../validators/userValidator.js";

const router = Router();

router.use(...guard.permission(PERMISSIONS.USERS_MANAGE));

router.get("/", listUsersValidator, validate, listUsers);
router.get("/:id", userIdValidator, validate, getUser);
router.post("/", createUserValidator, validate, createUser);
router.put("/:id", updateUserValidator, validate, updateUser);
router.delete("/:id", userIdValidator, validate, deleteUser);

export default router;
