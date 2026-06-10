import { get, post, put, del } from "@/services/api";
import type { User, UserFormData, UserListResponse } from "@/types/user";

export async function fetchUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<UserListResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const response = await get<UserListResponse>(`/users${qs ? `?${qs}` : ""}`);
  return response.data;
}

export async function fetchUser(id: string): Promise<User> {
  const response = await get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(data: UserFormData): Promise<User> {
  const response = await post<User>("/users", data);
  return response.data;
}

export async function updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
  const response = await put<User>(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await del(`/users/${id}`);
}
