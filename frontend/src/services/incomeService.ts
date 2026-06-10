import { get, post, put, del } from "@/services/api";
import type { IncomeEntry, FinancialListResponse } from "@/types/erp";

export async function fetchIncomes(params?: { search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await get<FinancialListResponse>(`/income?${query.toString()}`);
  return response.data;
}

export async function createIncome(data: { concept: string; value: number; date: string }) {
  const response = await post<IncomeEntry>("/income", data);
  return response.data;
}

export async function updateIncome(id: string, data: Partial<{ concept: string; value: number; date: string }>) {
  const response = await put<IncomeEntry>(`/income/${id}`, data);
  return response.data;
}

export async function deleteIncome(id: string) {
  await del(`/income/${id}`);
}
