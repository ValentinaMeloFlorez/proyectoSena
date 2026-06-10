import { useState } from "react";
import { downloadReport } from "@/services/reportService";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

const reportDefinitions = [
  { label: "Ventas", path: "/reports/sales" },
  { label: "Inventario", path: "/reports/inventory" },
  { label: "Clientes", path: "/reports/clients" },
  { label: "Financiero", path: "/reports/financial" },
];

export function ReportsPage() {
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (path: string) => {
    setError(null);
    setLoading(path);

    try {
      const { blob, filename } = await downloadReport(path, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el reporte");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Header title="Reportes" subtitle="Exporta reportes de ventas, inventario, clientes y finanzas" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="card space-y-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Formatos de exportación</h2>
              <p className="text-sm text-slate-500">Selecciona un formato para exportar tus reportes.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant={format === "pdf" ? undefined : "secondary"} onClick={() => setFormat("pdf")}>PDF</Button>
              <Button variant={format === "excel" ? undefined : "secondary"} onClick={() => setFormat("excel")}>Excel</Button>
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportDefinitions.map((report) => (
              <div key={report.path} className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">{report.label}</h3>
                <p className="mb-4 text-sm text-slate-500">Genera un archivo descargable con los datos clave del negocio.</p>
                <Button
                  onClick={() => handleDownload(report.path)}
                  isLoading={loading === report.path}
                  className="w-full"
                >
                  Descargar {format.toUpperCase()}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
