import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchProduct, createProduct, updateProduct } from "@/services/productService";
import type { ProductFormData } from "@/types/erp";

const emptyForm: ProductFormData = {
  code: "",
  name: "",
  category: "",
  purchasePrice: 0,
  salePrice: 0,
  stock: 0,
  stockThreshold: 10,
};

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [error, setError] = useState("");

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (product) {
      setForm({
        code: product.code,
        name: product.name,
        category: product.category,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        stock: product.stock,
        stockThreshold: product.stockThreshold,
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEdit ? updateProduct(id!, data) : createProduct(data),
    onSuccess: () => navigate("/products"),
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Error inesperado");
    },
  });

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "purchasePrice" || field === "salePrice" || field === "stock" || field === "stockThreshold"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  if (isEdit && loadingProduct) {
    return <div className="p-6 text-slate-500">Cargando producto...</div>;
  }

  return (
    <>
      <Header
        title={isEdit ? "Editar producto" : "Nuevo producto"}
        subtitle={isEdit ? `Modificar ${product?.name}` : "Registrar nuevo producto"}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Código" name="code" value={form.code} onChange={(e) => handleChange("code", e.target.value)} required />
            <Input label="Nombre" name="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
          </div>
          <Input label="Categoría" name="category" value={form.category} onChange={(e) => handleChange("category", e.target.value)} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Precio compra" name="purchasePrice" type="number" value={form.purchasePrice} onChange={(e) => handleChange("purchasePrice", e.target.value)} required />
            <Input label="Precio venta" name="salePrice" type="number" value={form.salePrice} onChange={(e) => handleChange("salePrice", e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Stock" name="stock" type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} required />
            <Input label="Alerta stock" name="stockThreshold" type="number" value={form.stockThreshold} onChange={(e) => handleChange("stockThreshold", e.target.value)} required />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/products")}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {isEdit ? "Guardar cambios" : "Crear producto"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
