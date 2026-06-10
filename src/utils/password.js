/**
 * Utilidades de contraseña con bcrypt
 */

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const validatePasswordStrength = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("Mínimo 8 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("Al menos una mayúscula");
  if (!/[a-z]/.test(password)) errors.push("Al menos una minúscula");
  if (!/[0-9]/.test(password)) errors.push("Al menos un número");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Al menos un carácter especial");
  return errors;
};
