import { Router } from "express";
import { body, param, query } from "express-validator";
import { guard } from "../middleware/routeGuard.js";
import { PERMISSIONS } from "../config/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

const listProductsValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número válido"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Límite debe ser un número válido"),
];

const productBodyValidator = [
  body("code").notEmpty().withMessage("Código es obligatorio"),
  body("name").notEmpty().withMessage("Nombre es obligatorio"),
  body("category").notEmpty().withMessage("Categoría es obligatoria"),
  body("purchasePrice").isFloat({ gt: 0 }).withMessage("Precio de compra debe ser mayor a cero"),
  body("salePrice").isFloat({ gt: 0 }).withMessage("Precio de venta debe ser mayor a cero"),
  body("stock").isInt({ min: 0 }).withMessage("Stock debe ser un número entero no negativo"),
];

const productIdValidator = [param("id").isUUID().withMessage("ID de producto inválido")];

router.get(
  "/",
  ...guard.anyPermission(PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_WRITE),
  listProductsValidator,
  validate,
  listProducts
);
router.get("/:id", ...guard.anyPermission(PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_WRITE), productIdValidator, validate, getProduct);
router.post("/", ...guard.permission(PERMISSIONS.PRODUCTS_WRITE), productBodyValidator, validate, createProduct);
router.put("/:id", ...guard.permission(PERMISSIONS.PRODUCTS_WRITE), productIdValidator, validate, updateProduct);
router.delete("/:id", ...guard.permission(PERMISSIONS.PRODUCTS_WRITE), productIdValidator, validate, deleteProduct);

export default router;
