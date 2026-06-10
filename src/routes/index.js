/**
 * Router principal — agrupa todas las rutas de la API v1
 */

import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import roleRoutes from "./roleRoutes.js";
import userRoutes from "./userRoutes.js";
import protectedRoutes from "./protectedRoutes.js";
import productRoutes from "./productRoutes.js";
import clientRoutes from "./clientRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import incomeRoutes from "./incomeRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import reportRoutes from "./reportRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/users", userRoutes);
router.use("/protected", protectedRoutes);
router.use("/products", productRoutes);
router.use("/clients", clientRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/income", incomeRoutes);
router.use("/expenses", expenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
router.use("/ai", aiRoutes);

export default router;
