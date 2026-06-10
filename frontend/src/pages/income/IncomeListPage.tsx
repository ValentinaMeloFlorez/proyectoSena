import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { fetchIncomes } from "@/services/incomeService";

export function IncomeListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["incomes", search, page],
    queryFn: () => fetchIncomes({ search, page, limit: 10 }),
  });

  const pagination = data?.pagination ?? { page: 1, totalPages: 0, total: 0 };

  return (
    <>
      <Header title="Ingresos" subtitle="Registra y consulta ingresos financieros" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por concepto o fecha..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-surface-border py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <Link to="/income/new">
            <Button>
              <Plus size={16} />
              Nuevo ingreso
            </Button>
          </Link>
        </div>

        {isLoading && <div className="card p-8 text-center text-slate-500">Cargando ingresos...</div>}

        {isError && (
          <div className="card border-red-200 bg-red-50 p-4 text-red-700">
            {error instanceof Error ? error.message : "Error al cargar ingresos"}
          </div>
        )}

        {data && (
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Concepto</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Valor</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                      No hay ingresos registrados
                    </td>
                  </tr>
                ) : (
                  data.items.map((entry) => (
                    <tr key={entry.id} className="border-b border-surface-border hover:bg-slate-50">
                      <td className="px-4 py-3">{entry.concept}</td>
                      <td className="px-4 py-3">${entry.value.toFixed(2)}</td>
                      <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString("es-CO")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination?.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              Página {pagination.page} de {pagination.totalPages} ({pagination.total} ingresos)
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Anterior
              </Button>
              <Button variant="secondary" disabled={page >= (pagination?.totalPages ?? 0)} onClick={() => setPage((p) => p + 1)}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
