import { body } from "express-validator";

export const aiPredictionValidator = [
  body("history")
    .isArray({ min: 3 })
    .withMessage("El historial debe ser un arreglo de al menos 3 valores numéricos"),
  body("history.*").isNumeric().withMessage("Todos los valores del historial deben ser numéricos"),
  body("companyId").optional().isString().withMessage("companyId debe ser una cadena"),
];

export const aiAnomalyValidator = [
  body("records")
    .isArray({ min: 1 })
    .withMessage("Debe enviar un arreglo de registros para detectar anomalías"),
  body("records.*.value").isNumeric().withMessage("Cada registro debe incluir un valor numérico"),
];

export const aiContextValidator = [
  body("context")
    .optional()
    .custom((value) => typeof value === "object" && value !== null)
    .withMessage("El contexto debe ser un objeto válido"),
];

export const aiAlertsValidator = [
  body("metrics")
    .optional()
    .custom((value) => typeof value === "object" && value !== null)
    .withMessage("Los métricos deben ser un objeto válido"),
];
