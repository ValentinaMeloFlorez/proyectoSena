/**
 * Controller — Autenticación HTTP
 */

import { authService } from "../services/authService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const REFRESH_COOKIE = "refreshToken";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.cookie(REFRESH_COOKIE, result.refreshToken, result.cookieOptions);

  return successResponse(res, {
    message: "Inicio de sesión exitoso",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE];
  const result = await authService.logout(refreshToken);

  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });

  return successResponse(res, { message: result.message });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE];
  const result = await authService.refresh(refreshToken);

  res.cookie(REFRESH_COOKIE, result.refreshToken, result.cookieOptions);

  return successResponse(res, {
    message: "Token renovado",
    data: {
      accessToken: result.accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  return successResponse(res, { data: profile });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  return successResponse(res, {
    message: result.message,
    data: {
      ...(result.resetToken && { resetToken: result.resetToken }),
      expiresIn: result.expiresIn,
    },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);

  return successResponse(res, { message: result.message });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

  return successResponse(res, { message: result.message });
});
