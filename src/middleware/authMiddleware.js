/**
 * Middleware de autenticación — verifica JWT access token
 */

import { verifyAccessToken } from "../utils/jwt.js";
import { userRepository } from "../repositories/userRepository.js";
import { roleService } from "../services/roleService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "./asyncHandler.js";

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
};

const buildReqUser = async (user) => {
  const permissions = await roleService.resolveUserPermissions(
    user.role,
    user.roleId,
    user.companyId
  );
  user.setPermissions(permissions);

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    document: user.document,
    role: user.role,
    roleId: user.roleId,
    companyId: user.companyId,
    permissions,
  };
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError("Token no proporcionado", 401, "NO_TOKEN");
  }

  const decoded = verifyAccessToken(token);
  const user = await userRepository.findById(decoded.sub);

  if (!user) {
    throw new AppError("Usuario no encontrado o inactivo", 401, "USER_NOT_FOUND");
  }

  req.user = await buildReqUser(user);
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await userRepository.findById(decoded.sub);
    if (user) {
      req.user = await buildReqUser(user);
    }
  } catch {
    // Ignorar token inválido
  }
  next();
});
