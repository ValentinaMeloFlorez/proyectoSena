import { get, post } from "@/services/api";
import type { Invoice, InvoiceListResponse, InvoiceFormData } from "@/types/erp";

const buildQuery = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString();
};

export async function fetchInvoices(params?: { search?: string; page?: number; limit?: number }): Promise<InvoiceListResponse> {
  const qs = buildQuery(params || {});
  const response = await get<InvoiceListResponse>(`/invoices${qs ? `?${qs}` : ""}`);
  return response.data;
}

export async function fetchInvoice(id: string): Promise<Invoice> {
  const response = await get<Invoice>(`/invoices/${id}`);
  return response.data;
}

export async function createInvoice(data: InvoiceFormData): Promise<Invoice> {
  const response = await post<Invoice>("/invoices", data);
  return response.data;
}
