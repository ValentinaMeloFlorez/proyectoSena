/**
 * Rutas del módulo de Roles — protegidas con guard.rolesManage
 */

import { Router } from "express";
import {
  listRoles,
  getRole,
  listPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";
import { guard } from "../middleware/routeGuard.js";
import { restrictSelfRoleChange } from "../middleware/authorizeMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createRoleValidator,
  updateRoleValidator,
  roleIdValidator,
} from "../validators/roleValidator.js";

const router = Router();

router.use(...guard.rolesManage);

router.get("/permissions", listPermissions);
router.get("/", listRoles);
router.get("/:id", roleIdValidator, validate, getRole);
router.post("/", createRoleValidator, validate, createRole);
router.put("/:id", updateRoleValidator, validate, restrictSelfRoleChange, updateRole);
router.delete("/:id", roleIdValidator, validate, deleteRole);

export default router;
