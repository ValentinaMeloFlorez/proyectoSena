import type { AuthUser } from "@/types/auth";

const TOKEN_KEY = "contaia_access_token";
const USER_KEY = "contaia_user";

export const authStore = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  getTokenPayload(): Record<string, unknown> | null {
    const token = this.getToken();
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload;
    } catch {
      return null;
    }
  },

  getPermissions(): string[] {
    const user = this.getUser();
    if (user?.permissions?.length) {
      return user.permissions;
    }

    const payload = this.getTokenPayload();
    if (payload && Array.isArray(payload.permissions)) {
      return payload.permissions.filter((perm): perm is string => typeof perm === "string");
    }

    return [];
  },

  setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  },
};
