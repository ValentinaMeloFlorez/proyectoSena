import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { fetchClients } from "@/services/clientService";
import { fetchProducts } from "@/services/productService";
import { createInvoice } from "@/services/invoiceService";
import type { Client, Product, ProductListResponse } from "@/types/erp";

interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export function InvoiceFormPage() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<CartItem[]>([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [error, setError] = useState("");

  const { data: clientItems = [] } = useQuery<Client[]>({ queryKey: ["clients"], queryFn: fetchClients });
  const { data: productList } = useQuery<ProductListResponse>({ queryKey: ["products", "invoice"], queryFn: () => fetchProducts({ page: 1, limit: 100 }) });

  const mutation = useMutation({
    mutationFn: (payload: any) => createInvoice(payload),
    onSuccess: () => navigate("/invoicing"),
    onError: (err: unknown) => setError(err instanceof Error ? err.message : "Error generando factura"),
  });

  const handleItemChange = (index: number, field: keyof CartItem, value: string | number) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: field === "quantity" || field === "unitPrice" ? Number(value) : String(value) } : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [...current, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const submitInvoice = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!clientId) {
      setError("Debe seleccionar un cliente");
      return;
    }
    mutation.mutate({ clientId, items });
  };

  const productOptions = productList?.items?.map((product: Product) => ({ value: product.id, label: `${product.code} - ${product.name}` })) || [];

  return (
    <>
      <Header title="Nueva factura" subtitle="Selecciona cliente, productos y genera la factura" />
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={submitInvoice} className="card mx-auto max-w-4xl space-y-4 p-6">
          <Select
            label="Cliente"
            name="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Seleccionar cliente..."
            options={clientItems.map((client: Client) => ({ value: client.id, label: client.name }))}
          />

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl border border-surface-border p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <Select
                    label="Producto"
                    name={`product-${index}`}
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                    options={productOptions}
                    placeholder="Seleccionar producto..."
                    className="flex-1"
                  />
                  <Input
                    label="Cantidad"
                    name={`quantity-${index}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  <Input
                    label="Precio unitario"
                    name={`price-${index}`}
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  <Button type="button" variant="secondary" className="max-w-xs" onClick={() => removeItem(index)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="secondary" onClick={addItem}>
            Agregar producto
          </Button>

          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate("/invoicing")}>Cancelar</Button>
            <Button type="submit" isLoading={mutation.isPending}>Generar factura</Button>
          </div>
        </form>
      </div>
    </>
  );
}
