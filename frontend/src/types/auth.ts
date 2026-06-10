export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  document?: string;
  role: string;
  roleId?: string;
  companyId: string;
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}
