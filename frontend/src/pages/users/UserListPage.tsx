import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchUsers, deleteUser } from "@/services/userService";

export function UserListPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", search, page],
    queryFn: () => fetchUsers({ search, page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar al usuario ${name}?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  return (
    <>
      <Header title="Usuarios" subtitle="Gestión de cuentas del sistema" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o documento..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-surface-border py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <Link to="/users/new">
            <Button>
              <Plus size={16} />
              Nuevo usuario
            </Button>
          </Link>
        </div>

        {isLoading && <div className="card p-8 text-center text-slate-500">Cargando usuarios...</div>}

        {isError && (
          <div className="card border-red-200 bg-red-50 p-4 text-red-700">
            {error instanceof Error ? error.message : "Error al cargar usuarios"}
          </div>
        )}

        {data && (
          <>
            <div className="card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-border bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-600">Nombre</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Documento</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Correo</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Rol</th>
                    <th className="px-4 py-3 font-medium text-slate-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    data.items.map((user) => (
                      <tr key={user.id} className="border-b border-surface-border last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{user.fullName}</td>
                        <td className="px-4 py-3 text-slate-600">{user.document}</td>
                        <td className="px-4 py-3 text-slate-600">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant="brand">{user.role}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Link to={`/users/${user.id}/edit`}>
                              <Button variant="secondary" className="!px-2 !py-1.5">
                                <Pencil size={14} />
                              </Button>
                            </Link>
                            <Button
                              variant="secondary"
                              className="!px-2 !py-1.5 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(user.id, user.fullName)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>
                  Página {data.pagination.page} de {data.pagination.totalPages} ({data.pagination.total} usuarios)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
