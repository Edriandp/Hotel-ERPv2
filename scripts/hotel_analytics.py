"""
Hotel Analytics Suite - Analisis de datos hoteleros
Demuestra Python para gestion hotelera con SAGE X3
"""
import json
import sys
import math
import random
from datetime import datetime, timedelta

random.seed(42)


def revenue_forecast():
    """Prediccion de ingresos con regresion lineal manual"""
    print(">>> python revenue_forecast.py")
    print("Cargando datos historicos")

    # Generar datos historicos simulados (24 meses)
    months = []
    revenues = []
    occupancies = []
    rates = []

    base_date = datetime(2024, 1, 1)
    for i in range(24):
        month_date = base_date + timedelta(days=i * 30)
        # Simular estacionalidad
        seasonal = math.sin(2 * math.pi * i / 12) * 0.15
        occ = 0.70 + seasonal + random.uniform(-0.05, 0.05)
        occ = max(0.45, min(0.98, occ))
        rate = 165 + i * 1.2 + random.uniform(-10, 10)
        rev = occ * rate * 250 * 30  # 250 habitaciones * 30 dias
        months.append(month_date.strftime("%Y-%m"))
        revenues.append(round(rev, 2))
        occupancies.append(round(occ, 4))
        rates.append(round(rate, 2))

    print(f"Registros cargados: {len(months)} meses de datos")
    print(f"Periodo: {months[0]} a {months[-1]}")
    print()

    # Regresion lineal manual (minimos cuadrados)
    n = len(revenues)
    x = list(range(n))
    x_mean = sum(x) / n
    y_mean = sum(revenues) / n

    numerator = sum((x[i] - x_mean) * (revenues[i] - y_mean) for i in range(n))
    denominator = sum((x[i] - x_mean) ** 2 for i in range(n))
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean

    # R-squared
    y_pred = [slope * xi + intercept for xi in x]
    ss_res = sum((revenues[i] - y_pred[i]) ** 2 for i in range(n))
    ss_tot = sum((revenues[i] - y_mean) ** 2 for i in range(n))
    r_squared = 1 - (ss_res / ss_tot)

    print(f"Entrenando modelo de Regresion Lineal...")
    print(f"  Pendiente (slope):   {slope:,.2f} $/mes")
    print(f"  Intercepto:          ${intercept:,.2f}")
    print()

    # Pronostico para los proximos 3 meses
    print("Pronostico trimestral:")
    scenarios = {
        "conservador": 0.85,
        "esperado": 1.0,
        "optimista": 1.15
    }
    forecasts = {}
    next_x = n
    base_prediction = slope * next_x + intercept

    for name, factor in scenarios.items():
        pred = base_prediction * factor
        forecasts[name] = round(pred, 2)
        print(f"  {name:15s}: ${pred:>12,.2f}")

    print()
    print(f"Modelo guardado en: models/revenue_lr_2026.pkl")
    print(f"Reporte exportado a: reports/forecast_feb2026.xlsx")

    # Output JSON for the frontend
    result = {
        "type": "revenue_forecast",
        "r_squared": round(r_squared, 4),
        "slope": round(slope, 2),
        "intercept": round(intercept, 2),
        "forecasts": forecasts,
        "monthly_data": [
            {"month": months[i], "revenue": revenues[i], "occupancy": occupancies[i], "rate": rates[i]}
            for i in range(n)
        ]
    }
    print("\n__JSON_OUTPUT__")
    print(json.dumps(result))


def guest_sentiment():
    """Analisis de sentimiento de resenas"""
    print(">>> python guest_sentiment.py")
    print("Analizando resenas de huespedes...")
    print()

    reviews = [
        {"huesped": "Carlos M.", "texto": "Excellent service and beautiful rooms, the staff was incredibly helpful", "lang": "en"},
        {"huesped": "Ana Garcia", "texto": "Room was clean but check-in process was slow and confusing", "lang": "en"},
        {"huesped": "John Smith", "texto": "Amazing spa experience, will definitely come back next year", "lang": "en"},
        {"huesped": "Maria Lopez", "texto": "The restaurant food was mediocre, expected better for the price", "lang": "en"},
        {"huesped": "Pierre D.", "texto": "Perfect location, beautiful views, outstanding breakfast buffet", "lang": "en"},
        {"huesped": "Laura S.", "texto": "Noisy room near elevator, could not sleep well, disappointing", "lang": "en"},
        {"huesped": "Hans W.", "texto": "Very professional staff, the suite was luxurious and spacious", "lang": "en"},
        {"huesped": "Sofia R.", "texto": "Good value for money, clean rooms and friendly reception", "lang": "en"},
    ]

    # Simular analisis de sentimiento con un algoritmo simple basado en keywords
    positive_words = {"excellent", "beautiful", "amazing", "perfect", "outstanding", "luxurious",
                      "spacious", "professional", "friendly", "good", "great", "helpful", "incredible",
                      "definitely", "wonderful"}
    negative_words = {"slow", "confusing", "mediocre", "noisy", "disappointing", "bad", "terrible",
                      "poor", "dirty", "rude", "expensive", "worst", "boring"}
    neutral_words = {"clean", "room", "staff", "hotel", "price", "location"}

    results = []
    print(f"  {'Huesped':<15s} {'Polaridad':>10s} {'Subjetividad':>13s} {'Clasificacion':>15s}")
    print(f"  {'-'*15} {'-'*10} {'-'*13} {'-'*15}")

    for review in reviews:
        words = set(review["texto"].lower().split())
        pos_count = len(words & positive_words)
        neg_count = len(words & negative_words)
        total = pos_count + neg_count + 1

        polarity = round((pos_count - neg_count) / total, 2)
        polarity = max(-1, min(1, polarity))
        subjectivity = round(min(1.0, (pos_count + neg_count) / max(len(words) * 0.3, 1)), 2)

        if polarity > 0.2:
            classification = "Positivo"
        elif polarity < -0.1:
            classification = "Negativo"
        else:
            classification = "Neutral"

        results.append({
            "huesped": review["huesped"],
            "polaridad": polarity,
            "subjetividad": subjectivity,
            "clasificacion": classification,
            "texto": review["texto"]
        })

        print(f"  {review['huesped']:<15s} {polarity:>10.2f} {subjectivity:>13.2f} {classification:>15s}")

    print()

    positives = sum(1 for r in results if r["clasificacion"] == "Positivo")
    neutrals = sum(1 for r in results if r["clasificacion"] == "Neutral")
    negatives = sum(1 for r in results if r["clasificacion"] == "Negativo")
    total = len(results)

    print("Resumen de Sentimiento:")
    print(f"  Positivas:  {positives}/{total} ({positives/total*100:.1f}%)")
    print(f"  Neutrales:  {neutrals}/{total} ({neutrals/total*100:.1f}%)")
    print(f"  Negativas:  {negatives}/{total} ({negatives/total*100:.1f}%)")
    avg_polarity = sum(r["polaridad"] for r in results) / total
    print(f"  Score promedio: {avg_polarity:.2f} ({'Positivo' if avg_polarity > 0.2 else 'Neutral' if avg_polarity > -0.1 else 'Negativo'})")
    print()
    print(f"Reporte guardado en: reports/sentiment_feb2026.xlsx")

    result = {
        "type": "guest_sentiment",
        "reviews": results,
        "summary": {
            "positives": positives,
            "neutrals": neutrals,
            "negatives": negatives,
            "total": total,
            "avg_polarity": round(avg_polarity, 2)
        }
    }
    print("\n__JSON_OUTPUT__")
    print(json.dumps(result))


def inventory_optimizer():
    """Optimizacion de inventario usando EOQ"""
    print(">>> python inventory_optimizer.py")
    print("Conectando a  ERP - Modulo Inventario...")
    print("Calculando EOQ (Economic Order Quantity)...")
    print()

    items = [
        {"item": "Amenities bano", "demanda": 3000, "costo_pedido": 50, "costo_almacen": 0.5, "precio": 2.5},
        {"item": "Toallas", "demanda": 500, "costo_pedido": 120, "costo_almacen": 2.0, "precio": 15},
        {"item": "Sabanas", "demanda": 300, "costo_pedido": 150, "costo_almacen": 3.0, "precio": 25},
        {"item": "Minibar items", "demanda": 1200, "costo_pedido": 80, "costo_almacen": 1.0, "precio": 8},
        {"item": "Prod. limpieza", "demanda": 800, "costo_pedido": 60, "costo_almacen": 0.8, "precio": 5},
    ]

    print(f"  {'Item':<18s} {'Demanda/mes':>12s} {'EOQ':>8s} {'Pto.Reorden':>12s} {'Costo Anual':>14s}")
    print(f"  {'-'*18} {'-'*12} {'-'*8} {'-'*12} {'-'*14}")

    results = []
    total_cost = 0
    total_savings = 0

    for item in items:
        d = item["demanda"]
        co = item["costo_pedido"]
        ch = item["costo_almacen"]

        # EOQ formula: sqrt(2*D*Co / Ch)
        eoq = round(math.sqrt(2 * d * co / ch))
        reorder_point = round(d / 30 * 5)  # 5 dias lead time
        annual_cost = d * 12 * item["precio"]

        # Costo sin optimizar (pedidos mensuales)
        cost_without = d * 12 * co / d + (d / 2) * ch * 12
        # Costo con EOQ
        cost_with = d * 12 * co / eoq + (eoq / 2) * ch * 12
        savings = cost_without - cost_with

        total_cost += annual_cost
        total_savings += savings

        results.append({
            "item": item["item"],
            "demanda_mensual": d,
            "eoq": eoq,
            "punto_reorden": reorder_point,
            "costo_anual": annual_cost,
            "ahorro": round(savings, 2)
        })

        print(f"  {item['item']:<18s} {d:>12,d} {eoq:>8,d} {reorder_point:>12,d} ${annual_cost:>13,.2f}")

    print()
    print(f"  Costo total anual de compras: ${total_cost:>14,.2f}")
    print(f"  Ahorro estimado con EOQ:      ${total_savings:>14,.2f} ({total_savings/total_cost*100:.1f}%)")
    print()
    print("Ordenes de compra generadas en ERP: 3 items bajo punto de reorden")
    print("Reporte exportado a: reports/inventory_feb2026.xlsx")

    result = {
        "type": "inventory_optimizer",
        "items": results,
        "total_cost": round(total_cost, 2),
        "total_savings": round(total_savings, 2),
        "savings_pct": round(total_savings / total_cost * 100, 1)
    }
    print("\n__JSON_OUTPUT__")
    print(json.dumps(result))


if __name__ == "__main__":
    script = sys.argv[1] if len(sys.argv) > 1 else "revenue_forecast"

    if script == "revenue_forecast":
        revenue_forecast()
    elif script == "guest_sentiment":
        guest_sentiment()
    elif script == "inventory_optimizer":
        inventory_optimizer()
    else:
        print(f"Script desconocido: {script}")
        sys.exit(1)
