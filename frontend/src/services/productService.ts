import { get, post, put, del } from "@/services/api";
import type { Product, ProductFormData, ProductListResponse } from "@/types/erp";

const buildQuery = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString();
};

export async function fetchProducts(params?: { search?: string; page?: number; limit?: number }): Promise<ProductListResponse> {
  const qs = buildQuery(params || {});
  const response = await get<ProductListResponse>(`/products${qs ? `?${qs}` : ""}`);
  return response.data;
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await post<Product>("/products", data);
  return response.data;
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
  const response = await put<Product>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await del(`/products/${id}`);
}
