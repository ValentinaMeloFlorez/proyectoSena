export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  details?: Array<{ field?: string; message: string }>;
  timestamp: string;
}

export interface HealthData {
  status: "healthy" | "degraded";
  app_name: string;
  version: string;
  environment: string;
  database: "connected" | "disconnected";
  timestamp: string;
}
