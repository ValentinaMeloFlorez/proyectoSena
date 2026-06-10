import { Activity, Database, RefreshCw, Server } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useHealth } from "@/hooks/useHealth";

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "healthy"
      ? "status-healthy"
      : status === "degraded"
        ? "status-degraded"
        : "status-error";

  return <span className={className}>{status}</span>;
}

export function Dashboard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHealth();

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Panel de control — CONTAIA PRO"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-slate-900">Estado del Sistema</h2>
            <p className="text-sm text-slate-500">
              Monitoreo en tiempo real de la infraestructura base
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => refetch()}
            isLoading={isFetching}
          >
            <RefreshCw size={16} />
            Actualizar
          </Button>
        </div>

        {isLoading && (
          <div className="card p-8 text-center text-slate-500">
            Verificando estado del sistema...
          </div>
        )}

        {isError && (
          <div className="card border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-800">Error de conexión con el backend</p>
            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
            <p className="mt-3 text-xs text-red-500">
              Asegúrate de que el backend esté corriendo en http://localhost:8000
            </p>
          </div>
        )}

        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-500">
                <Activity size={18} />
                <span className="text-sm font-medium">Estado General</span>
              </div>
              <StatusBadge status={data.status} />
            </div>

            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-500">
                <Server size={18} />
                <span className="text-sm font-medium">Aplicación</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{data.app_name}</p>
              <p className="text-xs text-slate-500">v{data.version}</p>
            </div>

            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-500">
                <Database size={18} />
                <span className="text-sm font-medium">Base de Datos</span>
              </div>
              <StatusBadge
                status={data.database === "connected" ? "healthy" : "degraded"}
              />
              <p className="mt-1 text-xs text-slate-500 capitalize">{data.database}</p>
            </div>

            <div className="card p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">Entorno</div>
              <p className="text-sm font-semibold capitalize text-slate-900">
                {data.environment}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Última verificación:{" "}
                {new Date(data.timestamp).toLocaleTimeString("es")}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 card p-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Módulo 1 — Fundación Completada
          </h3>
          <p className="text-sm text-slate-600">
            La infraestructura base está lista. Los próximos módulos habilitarán
            autenticación, gestión de empresas, contabilidad, facturación e
            inteligencia artificial.
          </p>
        </div>
      </div>
    </>
  );
}
