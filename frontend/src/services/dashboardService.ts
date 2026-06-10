import { get } from "@/services/api";
import type { DashboardMetrics } from "@/types/erp";

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await get<DashboardMetrics>("/dashboard");
  return response.data;
}
