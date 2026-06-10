import { get } from "@/services/api";
import type { HealthData } from "@/types/api";

export async function fetchHealthStatus(): Promise<HealthData> {
  const response = await get<HealthData>("/health");
  return response.data;
}
