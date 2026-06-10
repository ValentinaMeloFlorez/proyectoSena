import { get } from "@/services/api";
import type { RoleOption } from "@/types/user";

export async function fetchRoles(): Promise<RoleOption[]> {
  const response = await get<RoleOption[]>("/roles");
  return response.data;
}
