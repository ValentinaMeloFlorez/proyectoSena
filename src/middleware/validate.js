/**
 * Middleware — ejecuta validaciones de express-validator
 */

import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    const error = new AppError("Error de validación", 422, "VALIDATION_ERROR");
    error.details = details;
    return next(error);
  }
  next();
};
