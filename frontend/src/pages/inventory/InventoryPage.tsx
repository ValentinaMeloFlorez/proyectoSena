import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { fetchInventory, createInventoryMovement } from "@/services/inventoryService";
import { fetchProducts } from "@/services/productService";

export function InventoryPage() {
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({ productId: "", type: "entry", quantity: 0, newStock: 0, reason: "" });
  const [queryError, setQueryError] = useState<string | null>(null);

  const { data: products = { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } } = useQuery({
    queryKey: ["products", "inventory"],
    queryFn: () => fetchProducts({ search: "", page: 1, limit: 100 }),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetchInventory({ page: 1, limit: 10 }),
  });

  const mutation = useMutation({
    mutationFn: createInventoryMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products", "inventory"] });
      setForm({ productId: "", type: "entry", quantity: 0, newStock: 0, reason: "" });
      setQueryError(null);
    },
    onError: (err: unknown) => setQueryError(err instanceof Error ? err.message : "Error registrando movimiento"),
  });

  const movementTypes = [
    { value: "entry", label: "Entrada" },
    { value: "exit", label: "Salida" },
    { value: "adjustment", label: "Ajuste" },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setQueryError(null);
    mutation.mutate(form);
  };

  return (
    <>
      <Header title="Inventario" subtitle="Historial y movimientos de stock" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Registrar movimiento</h2>
                <p className="text-sm text-slate-500">Entradas, salidas y ajustes de producto.</p>
              </div>
              <Button variant="secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ["inventory"] })}>
                <RefreshCw size={16} />
                Actualizar
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Producto"
                name="productId"
                value={form.productId}
                onChange={(e) => setForm((prev) => ({ ...prev, productId: e.target.value }))}
                required
                options={products.items.map((product) => ({ value: product.id, label: `${product.code} - ${product.name}` }))}
                placeholder="Seleccionar producto..."
              />
              <Select
                label="Tipo de movimiento"
                name="type"
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                options={movementTypes}
              />
              {form.type === "adjustment" ? (
                <Input
                  label="Nuevo stock"
                  name="newStock"
                  type="number"
                  value={form.newStock}
                  min={0}
                  onChange={(e) => setForm((prev) => ({ ...prev, newStock: Number(e.target.value) }))}
                  required
                />
              ) : (
                <Input
                  label="Cantidad"
                  name="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  required
                />
              )}
              <Input
                label="Motivo"
                name="reason"
                value={form.reason}
                onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Ej: Recepción de proveedor, venta, ajuste de inventario"
              />
              {queryError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{queryError}</div>}
              <div className="flex justify-end">
                <Button type="submit" isLoading={mutation.isPending}>
                  Registrar movimiento
                </Button>
              </div>
            </form>
          </div>
          <div className="card p-6">
            <h2 className="text-base font-semibold text-slate-900">Resumen rápido</h2>
            <p className="mt-2 text-sm text-slate-500">Consulta los últimos movimientos y el stock actualizado.</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-surface-border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Productos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{products.pagination.total}</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Movimientos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{data?.pagination.total ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 card overflow-hidden">
          <div className="border-b border-surface-border bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Historial de movimientos
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-border bg-slate-50">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Stock anterior</th>
                <th className="px-4 py-3">Stock final</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Cargando movimientos...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-red-600">
                    {queryError ? queryError : (error instanceof Error ? error.message : "No se pudo cargar el historial")}
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No hay movimientos registrados
                  </td>
                </tr>
              ) : (
                (data?.items || []).map((movement) => (
                  <tr key={movement.id} className="border-b border-surface-border hover:bg-slate-50">
                    <td className="px-4 py-3">{movement.productId}</td>
                    <td className="px-4 py-3 capitalize">{movement.type}</td>
                    <td className="px-4 py-3">{movement.quantity}</td>
                    <td className="px-4 py-3">{movement.previousStock}</td>
                    <td className="px-4 py-3">{movement.resultingStock}</td>
                    <td className="px-4 py-3">{new Date(movement.performedAt).toLocaleString("es-CO")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
