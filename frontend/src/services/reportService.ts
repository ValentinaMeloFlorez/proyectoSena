import apiClient from "@/services/api";

export async function downloadReport(path: string, format: "pdf" | "excel" = "pdf") {
  const response = await apiClient.get<ArrayBuffer>(path, {
    responseType: "arraybuffer",
    params: { format },
  });

  const contentType = response.headers["content-type"];
  const blob = new Blob([response.data], { type: typeof contentType === "string" ? contentType : "application/pdf" });
  return {
    blob,
    filename: response.headers["content-disposition"]?.split("=")[1] || `reporte.${format === "excel" ? "xlsx" : "pdf"}`,
  };
}
