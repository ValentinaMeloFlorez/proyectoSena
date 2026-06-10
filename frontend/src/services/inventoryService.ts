import { get, post } from "@/services/api";
import type { InventoryListResponse } from "@/types/erp";

const buildQuery = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString();
};

export async function fetchInventory(params?: { productId?: string; type?: string; page?: number; limit?: number }): Promise<InventoryListResponse> {
  const qs = buildQuery(params || {});
  const response = await get<InventoryListResponse>(`/inventory${qs ? `?${qs}` : ""}`);
  return response.data;
}

export async function createInventoryMovement(body: Record<string, unknown>) {
  const response = await post("/inventory", body);
  return response.data;
}
