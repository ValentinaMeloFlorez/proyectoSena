/**
 * Wrapper para funciones async en controllers — evita try/catch repetitivo
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
