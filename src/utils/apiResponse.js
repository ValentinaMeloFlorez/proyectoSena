/**
 * Envelope estándar de respuestas API (capa Vista)
 */
export const successResponse = (res, { statusCode = 200, message = "Operación exitosa", data = null } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
