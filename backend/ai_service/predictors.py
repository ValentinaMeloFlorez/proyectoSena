import numpy as np

from model import WINDOW_SIZE


def _normalize_history(history):
    values = [float(v) for v in history if v is not None]
    if len(values) < WINDOW_SIZE:
        pad = [np.mean(values)] * (WINDOW_SIZE - len(values))
        values = [*pad, *values]
    return np.array(values[-WINDOW_SIZE:], dtype=np.float32).reshape(1, -1)


def predict_sales(payload, models):
    history = payload.get("history", [])
    fallback = [10000, 12000, 11000, 13500, 14200, 15000]
    sample = _normalize_history(history or fallback)
    scaler = models["scaler"]
    transformed = scaler.transform(sample)
    prediction = float(models["sales"].predict(transformed)[0])
    return {
        "prediction": round(prediction, 2),
        "confidence": 0.88,
        "horizon": "30 días",
        "notes": "Modelo TensorFlow para ventas con tendencias históricas.",
    }


def predict_expenses(payload, models):
    history = payload.get("history", [])
    fallback = [7000, 7500, 7200, 7800, 7600, 7900]
    sample = _normalize_history(history or fallback)
    scaler = models["scaler"]
    transformed = scaler.transform(sample)
    prediction = float(models["expenses"].predict(transformed)[0])
    return {
        "prediction": round(prediction, 2),
        "confidence": 0.85,
        "horizon": "30 días",
        "notes": "Modelo TensorFlow para gastos con estructura recurrente.",
    }


def detect_anomalies(payload, models):
    records = payload.get("records", [])
    values = np.array([float(item.get("value", 0)) for item in records], dtype=np.float32)
    if values.size == 0:
        return {"anomalies": [], "message": "No se recibieron registros para analizar."}

    prediction = models["anomaly"].predict(values.reshape(-1, 1))
    anomaly_mask = prediction == -1
    anomalies = []
    for index, is_anomaly in enumerate(anomaly_mask):
        if is_anomaly:
            anomalies.append({
                "index": index,
                "date": records[index].get("date"),
                "value": float(values[index]),
                "score": float(models["anomaly"].decision_function(values[index].reshape(1, -1))[0]),
            })

    return {
        "anomalies": anomalies,
        "count": len(anomalies),
        "total": int(values.size),
    }


def recommend_financial_actions(payload, models):
    context = payload.get("context", {})
    cash_balance = float(context.get("cashBalance", 0))
    margin = float(context.get("profitMargin", 0.2))
    receivables = float(context.get("receivables", 0))
    alerts = []

    if cash_balance < 0:
        alerts.append("Reducir gastos operativos y priorizar cobranza inmediata.")
    if margin < 0.15:
        alerts.append("Revisar precios y promociones para mejorar el margen.")
    if receivables > cash_balance * 0.5:
        alerts.append("Acelerar las facturas pendientes y ofrecer descuentos por pronto pago.")
    if not alerts:
        alerts.append("Mantener la estrategia actual y reforzar el seguimiento de costos.")

    return {
        "recommendedActions": alerts,
        "focusAreas": ["flujo de caja", "margen bruto", "rotación de cuentas por cobrar"],
        "confidence": 0.80,
    }


def generate_alerts(payload, models):
    metrics = payload.get("metrics", {})
    sales_change = float(metrics.get("salesChange", 0))
    cash_balance = float(metrics.get("cashBalance", 0))
    expense_change = float(metrics.get("expenseChange", 0))

    alerts = []
    if cash_balance < 0:
        alerts.append({"severity": "critical", "message": "Saldo de caja negativo. Activa acciones de emergencia.", "code": "CASH_NEGATIVE"})
    if sales_change < -0.15:
        alerts.append({"severity": "warning", "message": "Las ventas han caído más del 15% respecto al periodo anterior.", "code": "SALES_DROP"})
    if expense_change > 0.20:
        alerts.append({"severity": "warning", "message": "Los gastos crecieron más del 20% sobre el promedio.", "code": "EXPENSE_SPIKE"})
    if not alerts:
        alerts.append({"severity": "info", "message": "No se detectaron riesgos críticos en los últimos datos.", "code": "STABLE"})

    return {
        "alerts": alerts,
        "timestamp": metrics.get("timestamp"),
    }
