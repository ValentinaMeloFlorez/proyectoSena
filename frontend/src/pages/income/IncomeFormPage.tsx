import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createIncome } from "@/services/incomeService";

export function IncomeFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ concept: "", value: 0, date: new Date().toISOString().substring(0, 10) });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createIncome,
    onSuccess: () => navigate("/income"),
    onError: (err: unknown) => setError(err instanceof Error ? err.message : "Error guardando ingreso"),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  return (
    <>
      <Header title="Nuevo ingreso" subtitle="Registra un ingreso financiero" />
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl space-y-4 p-6">
          <Input label="Concepto" name="concept" value={form.concept} onChange={(e) => setForm((prev) => ({ ...prev, concept: e.target.value }))} required />
          <Input
            label="Valor"
            name="value"
            type="number"
            value={form.value}
            min={0}
            onChange={(e) => setForm((prev) => ({ ...prev, value: Number(e.target.value) }))}
            required
          />
          <Input label="Fecha" name="date" type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} required />
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate("/income")}>Cancelar</Button>
            <Button type="submit" isLoading={mutation.isPending}>Guardar ingreso</Button>
          </div>
        </form>
      </div>
    </>
  );
}
