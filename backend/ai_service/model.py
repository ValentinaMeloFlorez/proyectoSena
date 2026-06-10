from pathlib import Path
import numpy as np
from joblib import dump, load
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

MODEL_DIR = Path(__file__).resolve().parent / "models"
SALES_MODEL_PATH = MODEL_DIR / "sales_forecast"
EXPENSE_MODEL_PATH = MODEL_DIR / "expense_forecast"
ANOMALY_MODEL_PATH = MODEL_DIR / "anomaly_model.joblib"
SCALER_PATH = MODEL_DIR / "scaler.joblib"
RECOMMENDATION_MODEL_PATH = MODEL_DIR / "recommendation_model.joblib"

WINDOW_SIZE = 6


def ensure_models_dir():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)


def create_time_series(values, window_size=WINDOW_SIZE):
    x = []
    y = []
    for i in range(len(values) - window_size):
        x.append(values[i : i + window_size])
        y.append(values[i + window_size])
    return np.array(x, dtype=np.float32), np.array(y, dtype=np.float32)


def build_forecast_model(input_shape):
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(input_shape,)),
            tf.keras.layers.Dense(32, activation="relu"),
            tf.keras.layers.Dense(16, activation="relu"),
            tf.keras.layers.Dense(1, activation="linear"),
        ]
    )
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.01), loss="mse", metrics=["mae"])
    return model


def build_anomaly_model(records):
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(records.reshape(-1, 1))
    return model


def build_recommendation_model():
    X = np.array([
        [10000, 2000, 0.15],
        [25000, 8000, 0.30],
        [5000, 1000, 0.10],
        [40000, 12000, 0.25],
        [15000, 2400, 0.18],
    ], dtype=np.float32)
    y = np.array([1, 2, 0, 1, 0], dtype=np.float32)
    model = LinearRegression()
    model.fit(X, y)
    return model


def train_default_models():
    ensure_models_dir()

    default_sales = np.linspace(25000, 35000, 30, dtype=np.float32) + np.random.normal(0, 1200, 30).astype(np.float32)
    default_expenses = np.linspace(12000, 18000, 30, dtype=np.float32) + np.random.normal(0, 700, 30).astype(np.float32)

    sales_x, sales_y = create_time_series(default_sales)
    expense_x, expense_y = create_time_series(default_expenses)

    scaler = StandardScaler()
    scaler.fit(np.vstack([sales_x, expense_x]))
    dump(scaler, SCALER_PATH)

    sales_model = build_forecast_model(WINDOW_SIZE)
    sales_model.fit(scaler.transform(sales_x), sales_y, epochs=25, batch_size=8, verbose=0)
    sales_model.save(str(SALES_MODEL_PATH), save_format="tf")

    expense_model = build_forecast_model(WINDOW_SIZE)
    expense_model.fit(scaler.transform(expense_x), expense_y, epochs=25, batch_size=8, verbose=0)
    expense_model.save(str(EXPENSE_MODEL_PATH), save_format="tf")

    anomaly_records = np.concatenate([default_sales, default_expenses]).astype(np.float32)
    anomaly_model = build_anomaly_model(anomaly_records)
    dump(anomaly_model, ANOMALY_MODEL_PATH)

    recommendation_model = build_recommendation_model()
    dump(recommendation_model, RECOMMENDATION_MODEL_PATH)


def load_models():
    ensure_models_dir()

    scaler = load(str(SCALER_PATH)) if SCALER_PATH.exists() else None
    if scaler is None or not SALES_MODEL_PATH.exists() or not EXPENSE_MODEL_PATH.exists():
        train_default_models()
        scaler = load(str(SCALER_PATH))

    sales_model = tf.keras.models.load_model(str(SALES_MODEL_PATH))
    expense_model = tf.keras.models.load_model(str(EXPENSE_MODEL_PATH))
    anomaly_model = load(str(ANOMALY_MODEL_PATH))
    recommendation_model = load(str(RECOMMENDATION_MODEL_PATH))

    return {
        "sales": sales_model,
        "expenses": expense_model,
        "anomaly": anomaly_model,
        "recommendation": recommendation_model,
        "scaler": scaler,
    }


def ensure_models_ready():
    ensure_models_dir()
    if not (SALES_MODEL_PATH.exists() and EXPENSE_MODEL_PATH.exists() and ANOMALY_MODEL_PATH.exists() and RECOMMENDATION_MODEL_PATH.exists() and SCALER_PATH.exists()):
        train_default_models()
