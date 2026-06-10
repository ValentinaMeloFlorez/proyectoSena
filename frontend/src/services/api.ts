import axios, { AxiosError, AxiosInstance } from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { authStore } from "@/stores/authStore";
import type { APIResponse, ErrorResponse } from "@/types/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      authStore.clear();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message || error.message || "Error de conexión";
    return Promise.reject(new Error(message));
  }
);

export async function get<T>(url: string): Promise<APIResponse<T>> {
  const response = await apiClient.get<APIResponse<T>>(url);
  return response.data;
}

export async function post<T>(url: string, body: unknown): Promise<APIResponse<T>> {
  const response = await apiClient.post<APIResponse<T>>(url, body);
  return response.data;
}

export async function put<T>(url: string, body: unknown): Promise<APIResponse<T>> {
  const response = await apiClient.put<APIResponse<T>>(url, body);
  return response.data;
}

export async function del<T>(url: string): Promise<APIResponse<T>> {
  const response = await apiClient.delete<APIResponse<T>>(url);
  return response.data;
}

export default apiClient;
