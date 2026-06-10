import { post } from "@/services/api";
import { authStore } from "@/stores/authStore";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>("/auth/login", credentials);
  authStore.setSession(response.data.accessToken, response.data.user);
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await post("/auth/logout", {});
  } finally {
    authStore.clear();
  }
}

export async function fetchProfile() {
  const { get } = await import("@/services/api");
  const response = await get("/auth/me");
  return response.data;
}
