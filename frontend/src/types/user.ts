export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  document: string;
  email: string;
  role: string;
  roleId: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  password?: string;
  roleId: string;
}

export interface UserListResponse {
  items: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RoleOption {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
}
