import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
  detectAnomalies,
  fetchRecommendations,
  fetchSmartAlerts,
  predictExpenses,
  predictSales,
} from "@/services/aiService";
import type {
  AIPredictionResponse,
  AIAnomalyResponse,
  AIRecommendationResponse,
  AISmartAlertResponse,
} from "@/types/erp";

const parseHistory = (value: string) =>
  value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));

export function AIPage() {
  const [salesHistory, setSalesHistory] = useState("12000,13000,11000,14000,14500,15000");
  const [expenseHistory, setExpenseHistory] = useState("7000,7200,7100,7400,7600,7800");
  const [metrics, setMetrics] = useState("{\n  \"cashBalance\": 12000,\n  \"salesChange\": -0.08,\n  \"expenseChange\": 0.12,\n  \"profitMargin\": 0.18,\n  \"receivables\": 3500\n}");

  const salesMutation = useMutation<AIPredictionResponse, Error, { history: number[] }>({
    mutationFn: (payload) => predictSales(payload),
  });
  const expenseMutation = useMutation<AIPredictionResponse, Error, { history: number[] }>({
    mutationFn: (payload) => predictExpenses(payload),
  });
  const anomalyMutation = useMutation<AIAnomalyResponse, Error, { records: Array<{ date?: string; value: number }> }>({
    mutationFn: (payload) => detectAnomalies(payload),
  });
  const recommendationMutation = useMutation<AIRecommendationResponse, Error, { context?: Record<string, unknown> }>({
    mutationFn: (payload) => fetchRecommendations(payload),
  });
  const alertMutation = useMutation<AISmartAlertResponse, Error, { metrics?: Record<string, unknown> }>({
    mutationFn: (payload) => fetchSmartAlerts(payload),
  });

  const inputMetrics = () => {
    try {
      return JSON.parse(metrics);
    } catch {
      return {};
    }
  };

  return (
    <>
      <Header title="Inteligencia Artificial" subtitle="Predicciones, detección de anomalías y recomendaciones financieras" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid gap-4 xl:grid-cols-2">
          <section className="card p-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Predicción de ventas</h2>
            <p className="mb-4 text-sm text-slate-500">Envía el historial de ventas para obtener una predicción del próximo periodo.</p>
            <textarea
              rows={3}
              value={salesHistory}
              onChange={(event) => setSalesHistory(event.target.value)}
              className="w-full rounded-lg border border-surface-border bg-slate-50 p-3 text-sm"
            />
            <Button
              className="mt-4"
              isLoading={salesMutation.isPending}
              onClick={() => salesMutation.mutate({ history: parseHistory(salesHistory) })}
            >
              Generar predicción
            </Button>
            {salesMutation.data && (
              <div className="mt-4 rounded-2xl border border-surface-border bg-white p-4 text-sm text-slate-700">
                <p><strong>Predicción:</strong> ${salesMutation.data.prediction.toFixed(2)}</p>
                <p><strong>Horizonte:</strong> {salesMutation.data.horizon}</p>
                <p><strong>Confianza:</strong> {salesMutation.data.confidence * 100}%</p>
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Predicción de gastos</h2>
            <p className="mb-4 text-sm text-slate-500">Envía el historial de gastos para estimar el próximo consumo de recursos.</p>
            <textarea
              rows={3}
              value={expenseHistory}
              onChange={(event) => setExpenseHistory(event.target.value)}
              className="w-full rounded-lg border border-surface-border bg-slate-50 p-3 text-sm"
            />
            <Button
              className="mt-4"
              isLoading={expenseMutation.isPending}
              onClick={() => expenseMutation.mutate({ history: parseHistory(expenseHistory) })}
            >
              Generar predicción
            </Button>
            {expenseMutation.data && (
              <div className="mt-4 rounded-2xl border border-surface-border bg-white p-4 text-sm text-slate-700">
                <p><strong>Predicción:</strong> ${expenseMutation.data.prediction.toFixed(2)}</p>
                <p><strong>Horizonte:</strong> {expenseMutation.data.horizon}</p>
                <p><strong>Confianza:</strong> {expenseMutation.data.confidence * 100}%</p>
              </div>
            )}
          </section>
        </div>

        <section className="card p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Detección de anomalías</h2>
          <p className="mb-4 text-sm text-slate-500">Analiza registros de valor para detectar comportamientos atípicos.</p>
          <Button
            isLoading={anomalyMutation.isPending}
            onClick={() => {
              anomalyMutation.mutate({
                records: parseHistory(salesHistory).map((value, index) => ({ date: `2026-06-${index + 1}`, value })),
              });
            }}
          >
            Detectar anomalías
          </Button>
          {anomalyMutation.data && (
            <div className="mt-4 rounded-2xl border border-surface-border bg-white p-4 text-sm text-slate-700">
              <p><strong>Anomalías encontradas:</strong> {anomalyMutation.data.count}</p>
              <pre className="mt-3 overflow-x-auto text-xs text-slate-600">{JSON.stringify(anomalyMutation.data.anomalies, null, 2)}</pre>
            </div>
          )}
        </section>

        <section className="card p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Recomendaciones financieras</h2>
          <p className="mb-4 text-sm text-slate-500">Envía el contexto de negocio para recibir acciones recomendadas.</p>
          <textarea
            rows={6}
            value={metrics}
            onChange={(event) => setMetrics(event.target.value)}
            className="w-full rounded-lg border border-surface-border bg-slate-50 p-3 text-sm"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              isLoading={recommendationMutation.isPending}
              onClick={() => recommendationMutation.mutate({ context: inputMetrics() })}
            >
              Obtener recomendaciones
            </Button>
            <Button
              variant="secondary"
              isLoading={alertMutation.isPending}
              onClick={() => alertMutation.mutate({ metrics: inputMetrics() })}
            >
              Generar alertas inteligentes
            </Button>
          </div>

          {recommendationMutation.data && (
            <div className="mt-4 rounded-2xl border border-surface-border bg-white p-4 text-sm text-slate-700">
              <p><strong>Acciones:</strong></p>
              <ul className="list-disc pl-5">
                {recommendationMutation.data.recommendedActions.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          )}

          {alertMutation.data && (
            <div className="mt-4 rounded-2xl border border-surface-border bg-white p-4 text-sm text-slate-700">
              <p><strong>Alertas:</strong></p>
              <ul className="list-disc pl-5">
                {alertMutation.data.alerts.map((alert, index) => (
                  <li key={index}>{alert.message} ({alert.severity})</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
