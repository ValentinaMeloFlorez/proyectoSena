import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { reportService } from "../services/reportService.js";

export const generateSalesReport = asyncHandler(async (req, res) => {
  const format = String(req.query.format || "pdf").toLowerCase();
  const report = await reportService.generateSalesReport(req.user.companyId, format);
  res.setHeader("Content-Type", report.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename=ventas.${format === "excel" ? "xlsx" : "pdf"}`);
  res.send(report.buffer);
});

export const generateInventoryReport = asyncHandler(async (req, res) => {
  const format = String(req.query.format || "pdf").toLowerCase();
  const report = await reportService.generateInventoryReport(req.user.companyId, format);
  res.setHeader("Content-Type", report.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename=inventario.${format === "excel" ? "xlsx" : "pdf"}`);
  res.send(report.buffer);
});

export const generateClientsReport = asyncHandler(async (req, res) => {
  const format = String(req.query.format || "pdf").toLowerCase();
  const report = await reportService.generateClientsReport(req.user.companyId, format);
  res.setHeader("Content-Type", report.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename=clientes.${format === "excel" ? "xlsx" : "pdf"}`);
  res.send(report.buffer);
});

export const generateFinancialReport = asyncHandler(async (req, res) => {
  const format = String(req.query.format || "pdf").toLowerCase();
  const report = await reportService.generateFinancialReport(req.user.companyId, format);
  res.setHeader("Content-Type", report.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename=financiero.${format === "excel" ? "xlsx" : "pdf"}`);
  res.send(report.buffer);
});
