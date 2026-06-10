/**
 * Utilidades JWT — access, refresh y reset tokens
 */

import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "./AppError.js";

export const signAccessToken = (payload) =>
  jwt.sign({ ...payload, type: "access" }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

export const signRefreshToken = (payload) =>
  jwt.sign({ ...payload, type: "refresh" }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

export const signResetToken = (payload) =>
  jwt.sign({ ...payload, type: "reset" }, config.jwtSecret, {
    expiresIn: config.jwtResetExpiresIn,
  });

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.type !== "access") throw new AppError("Tipo de token inválido", 401, "INVALID_TOKEN");
    return decoded;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Token de acceso inválido o expirado", 401, "INVALID_TOKEN");
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    if (decoded.type !== "refresh") throw new AppError("Tipo de token inválido", 401, "INVALID_TOKEN");
    return decoded;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Refresh token inválido o expirado", 401, "INVALID_TOKEN");
  }
};

export const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.type !== "reset") throw new AppError("Token de recuperación inválido", 400, "INVALID_RESET_TOKEN");
    return decoded;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Token de recuperación inválido o expirado", 400, "INVALID_RESET_TOKEN");
  }
};
