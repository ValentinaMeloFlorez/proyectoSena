/**
 * Service — Lógica de negocio de autenticación
 */

import { config } from "../config/index.js";
import { userRepository } from "../repositories/userRepository.js";
import { roleService } from "../services/roleService.js";
import { AppError } from "../utils/AppError.js";
import {
  signAccessToken,
  signRefreshToken,
  signResetToken,
  verifyRefreshToken,
  verifyResetToken,
} from "../utils/jwt.js";
import { comparePassword, hashPassword, validatePasswordStrength } from "../utils/password.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth",
};

export class AuthService {
  _buildTokenPayload(user) {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      permissions: user.permissions,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
    }

    user.lastLoginAt = new Date().toISOString();
    await userRepository.update(user);

    const permissions = await roleService.resolveUserPermissions(
      user.role,
      user.roleId,
      user.companyId
    );
    user.setPermissions(permissions);

    const payload = this._buildTokenPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ sub: user.id });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      cookieOptions: COOKIE_OPTIONS,
    };
  }

  async logout(refreshToken) {
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000).toISOString();
        await userRepository.addToBlacklist(refreshToken, expiresAt);
      } catch {
        // Token ya inválido — logout igual es exitoso
      }
    }
    return { message: "Sesión cerrada correctamente" };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token no proporcionado", 401, "NO_REFRESH_TOKEN");
    }

    if (await userRepository.isBlacklisted(refreshToken)) {
      throw new AppError("Token revocado", 401, "TOKEN_REVOKED");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(decoded.sub);
    if (!user) {
      throw new AppError("Usuario no encontrado", 401, "USER_NOT_FOUND");
    }

    const permissions = await roleService.resolveUserPermissions(
      user.role,
      user.roleId,
      user.companyId
    );
    user.setPermissions(permissions);

    const payload = this._buildTokenPayload(user);
    const accessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken({ sub: user.id });

    await userRepository.addToBlacklist(refreshToken, new Date(decoded.exp * 1000).toISOString());

    return {
      accessToken,
      refreshToken: newRefreshToken,
      cookieOptions: COOKIE_OPTIONS,
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }
    return user.toJSON();
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    const genericMessage = "Si el correo existe, recibirás instrucciones para restablecer tu contraseña";

    if (!user) {
      return { message: genericMessage, resetToken: null };
    }

    const resetToken = signResetToken({ sub: user.id, email: user.email });

    return {
      message: genericMessage,
      resetToken: config.isProduction ? null : resetToken,
      expiresIn: config.jwtResetExpiresIn,
    };
  }

  async resetPassword(token, newPassword) {
    const strengthErrors = validatePasswordStrength(newPassword);
    if (strengthErrors.length > 0) {
      throw new AppError("Contraseña débil", 422, "WEAK_PASSWORD", strengthErrors);
    }

    const decoded = verifyResetToken(token);
    const user = await userRepository.findById(decoded.sub);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.updatePassword(user.id, passwordHash);

    return { message: "Contraseña actualizada correctamente" };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) {
      throw new AppError("Contraseña actual incorrecta", 401, "INVALID_PASSWORD");
    }

    const strengthErrors = validatePasswordStrength(newPassword);
    if (strengthErrors.length > 0) {
      throw new AppError("Contraseña débil", 422, "WEAK_PASSWORD", strengthErrors);
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.updatePassword(user.id, passwordHash);

    return { message: "Contraseña cambiada correctamente" };
  }
}

export const authService = new AuthService();
