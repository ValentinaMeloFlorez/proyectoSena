import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { fetchProducts, deleteProduct } from "@/services/productService";
import type { Product } from "@/types/erp";

export function ProductListPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", search, page],
    queryFn: () => fetchProducts({ search, page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar el producto ${product.name}?`)) return;
    try {
      await deleteMutation.mutateAsync(product.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar producto");
    }
  };

  return (
    <>
      <Header title="Productos" subtitle="Gestión de catálogo de productos" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por código, nombre o categoría..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-surface-border py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <Link to="/products/new">
            <Button>
              <Plus size={16} />
              Nuevo producto
            </Button>
          </Link>
        </div>

        {isLoading && <div className="card p-8 text-center text-slate-500">Cargando productos...</div>}

        {isError && (
          <div className="card border-red-200 bg-red-50 p-4 text-red-700">
            {error instanceof Error ? error.message : "Error al cargar productos"}
          </div>
        )}

        {data && (
          <>
            <div className="card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-border bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-600">Código</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Nombre</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Categoría</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Stock</th>
                    <th className="px-4 py-3 font-medium text-slate-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No se encontraron productos
                      </td>
                    </tr>
                  ) : (
                    data.items.map((product) => (
                      <tr key={product.id} className="border-b border-surface-border last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{product.code}</td>
                        <td className="px-4 py-3 text-slate-600">{product.name}</td>
                        <td className="px-4 py-3 text-slate-600">{product.category}</td>
                        <td className={`px-4 py-3 font-medium ${product.lowStock ? "text-amber-600" : "text-slate-700"}`}>
                          {product.stock}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Link to={`/products/${product.id}/edit`}>
                              <Button variant="secondary" className="!px-2 !py-1.5">
                                <Pencil size={14} />
                              </Button>
                            </Link>
                            <Button
                              variant="secondary"
                              className="!px-2 !py-1.5 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(product)}
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
                  Página {data.pagination.page} de {data.pagination.totalPages} ({data.pagination.total} productos)
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                  </Button>
                  <Button variant="secondary" disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
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
