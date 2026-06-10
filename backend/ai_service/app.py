from flask import Flask, jsonify, request
from flask_cors import CORS

from model import load_models, ensure_models_ready
from predictors import (
    detect_anomalies,
    generate_alerts,
    predict_expenses,
    predict_sales,
    recommend_financial_actions,
)

app = Flask(__name__)
CORS(app)

ensure_models_ready()
models = load_models()

@app.route("/predict/sales", methods=["POST"])
def predict_sales_endpoint():
    payload = request.get_json() or {}
    prediction = predict_sales(payload, models)
    return jsonify({"success": True, "message": "Predicción de ventas generada", "data": prediction})

@app.route("/predict/expenses", methods=["POST"])
def predict_expenses_endpoint():
    payload = request.get_json() or {}
    prediction = predict_expenses(payload, models)
    return jsonify({"success": True, "message": "Predicción de gastos generada", "data": prediction})

@app.route("/detect/anomalies", methods=["POST"])
def detect_anomalies_endpoint():
    payload = request.get_json() or {}
    anomalies = detect_anomalies(payload, models)
    return jsonify({"success": True, "message": "Anomalías detectadas", "data": anomalies})

@app.route("/recommendations/financial", methods=["POST"])
def recommendations_endpoint():
    payload = request.get_json() or {}
    recommendations = recommend_financial_actions(payload, models)
    return jsonify({"success": True, "message": "Recomendaciones financieras generadas", "data": recommendations})

@app.route("/alerts/intelligent", methods=["POST"])
def alerts_endpoint():
    payload = request.get_json() or {}
    alerts = generate_alerts(payload, models)
    return jsonify({"success": True, "message": "Alertas inteligentes generadas", "data": alerts})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"success": True, "message": "Servicio IA disponible", "data": {"status": "healthy"}})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
