import { get, post, put, del } from "@/services/api";
import type { ExpenseEntry, FinancialListResponse } from "@/types/erp";

export async function fetchExpenses(params?: { search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await get<FinancialListResponse>(`/expenses?${query.toString()}`);
  return response.data;
}

export async function createExpense(data: { concept: string; value: number; date: string }) {
  const response = await post<ExpenseEntry>("/expenses", data);
  return response.data;
}

export async function updateExpense(id: string, data: Partial<{ concept: string; value: number; date: string }>) {
  const response = await put<ExpenseEntry>(`/expenses/${id}`, data);
  return response.data;
}

export async function deleteExpense(id: string) {
  await del(`/expenses/${id}`);
}
