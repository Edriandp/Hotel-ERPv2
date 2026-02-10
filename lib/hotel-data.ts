// Simulated hotel management data - represents SAGE X3 ERP data
export const hotelKPIs = {
  occupancyRate: 78.5,
  averageDailyRate: 185.0,
  revPAR: 145.23,
  totalRooms: 250,
  occupiedRooms: 196,
  availableRooms: 54,
  pendingCheckIns: 12,
  pendingCheckOuts: 8,
  totalRevenue: 1245680,
  monthlyTarget: 1500000,
  guestSatisfaction: 4.6,
}

export const monthlyRevenue = [
  { month: "Ene", ingresos: 98500, gastos: 72300, ocupacion: 65 },
  { month: "Feb", ingresos: 112000, gastos: 78500, ocupacion: 72 },
  { month: "Mar", ingresos: 135000, gastos: 82100, ocupacion: 78 },
  { month: "Abr", ingresos: 128000, gastos: 79800, ocupacion: 75 },
  { month: "May", ingresos: 145000, gastos: 85200, ocupacion: 82 },
  { month: "Jun", ingresos: 168000, gastos: 92400, ocupacion: 88 },
  { month: "Jul", ingresos: 195000, gastos: 98700, ocupacion: 95 },
  { month: "Ago", ingresos: 189000, gastos: 96300, ocupacion: 93 },
  { month: "Sep", ingresos: 152000, gastos: 87500, ocupacion: 80 },
  { month: "Oct", ingresos: 138000, gastos: 81900, ocupacion: 76 },
  { month: "Nov", ingresos: 125000, gastos: 78200, ocupacion: 70 },
  { month: "Dic", ingresos: 160000, gastos: 89800, ocupacion: 85 },
]

export const roomTypeDistribution = [
  { tipo: "Individual", cantidad: 80, tarifa: 120, ocupacion: 85 },
  { tipo: "Doble", cantidad: 90, tarifa: 175, ocupacion: 78 },
  { tipo: "Suite Jr.", cantidad: 45, tarifa: 280, ocupacion: 72 },
  { tipo: "Suite", cantidad: 25, tarifa: 450, ocupacion: 65 },
  { tipo: "Presidencial", cantidad: 10, tarifa: 850, ocupacion: 55 },
]

export const recentReservations = [
  { id: "RES-2026-001", guest: "Carlos Martinez", room: "Suite 401", checkIn: "2026-02-10", checkOut: "2026-02-14", status: "confirmada", total: 1800, source: "Booking.com" },
  { id: "RES-2026-002", guest: "Ana Garcia Lopez", room: "Doble 205", checkIn: "2026-02-10", checkOut: "2026-02-12", status: "check-in", total: 350, source: "Directo" },
  { id: "RES-2026-003", guest: "John Smith", room: "Suite Jr. 302", checkIn: "2026-02-11", checkOut: "2026-02-15", status: "pendiente", total: 1120, source: "Expedia" },
  { id: "RES-2026-004", guest: "Maria Fernandez", room: "Individual 108", checkIn: "2026-02-10", checkOut: "2026-02-11", status: "check-in", total: 120, source: "Directo" },
  { id: "RES-2026-005", guest: "Pierre Dupont", room: "Presidencial 501", checkIn: "2026-02-12", checkOut: "2026-02-16", status: "confirmada", total: 3400, source: "Agencia" },
  { id: "RES-2026-006", guest: "Laura Sanchez", room: "Doble 210", checkIn: "2026-02-10", checkOut: "2026-02-13", status: "check-out", total: 525, source: "Booking.com" },
]

export const departmentExpenses = [
  { departamento: "Recepcion", presupuesto: 45000, real: 42300, variacion: -6 },
  { departamento: "Housekeeping", presupuesto: 38000, real: 41200, variacion: 8.4 },
  { departamento: "F&B", presupuesto: 62000, real: 58900, variacion: -5 },
  { departamento: "Mantenimiento", presupuesto: 28000, real: 29500, variacion: 5.4 },
  { departamento: "Marketing", presupuesto: 22000, real: 19800, variacion: -10 },
  { departamento: "Spa & Wellness", presupuesto: 18000, real: 17200, variacion: -4.4 },
]

export const sageX3Modules = [
  { 
    module: "Contabilidad General", 
    status: "activo", 
    lastSync: "2026-02-10 08:30",
    records: 15420,
    description: "Libro mayor, cuentas por cobrar/pagar, conciliacion bancaria"
  },
  { 
    module: "Gestion de Compras", 
    status: "activo", 
    lastSync: "2026-02-10 07:45",
    records: 3280,
    description: "Ordenes de compra, proveedores, recepcion de mercancias"
  },
  { 
    module: "Control de Inventario", 
    status: "activo", 
    lastSync: "2026-02-10 09:15",
    records: 8750,
    description: "Stock de amenities, lenceria, suministros F&B"
  },
  { 
    module: "Recursos Humanos", 
    status: "activo", 
    lastSync: "2026-02-10 06:00",
    records: 342,
    description: "Nominas, turnos, vacaciones, evaluaciones"
  },
  { 
    module: "Facturacion", 
    status: "sincronizando", 
    lastSync: "2026-02-10 09:45",
    records: 28900,
    description: "Facturas, notas de credito, cobros automaticos"
  },
  { 
    module: "Activos Fijos", 
    status: "activo", 
    lastSync: "2026-02-09 23:00",
    records: 1250,
    description: "Mobiliario, equipos, depreciacion, mantenimiento preventivo"
  },
]

export const n8nWorkflows = [
  {
    id: "WF-001",
    name: "Check-in Automatico",
    trigger: "Webhook - PMS",
    status: "activo",
    executions: 1245,
    lastRun: "2026-02-10 09:30",
    successRate: 98.5,
    steps: [
      "Recibir datos del PMS",
      "Validar reserva en SAGE X3",
      "Generar tarjeta de acceso",
      "Enviar email de bienvenida",
      "Notificar a Housekeeping",
      "Actualizar dashboard"
    ],
    description: "Automatiza el proceso de check-in enviando notificaciones y actualizando sistemas"
  },
  {
    id: "WF-002",
    name: "Reporte Diario de Ingresos",
    trigger: "Cron - 23:59",
    status: "activo",
    executions: 365,
    lastRun: "2026-02-09 23:59",
    successRate: 99.7,
    steps: [
      "Consultar ventas del dia en SAGE X3",
      "Procesar datos con Python",
      "Generar reporte Excel",
      "Enviar por email a gerencia",
      "Archivar en SharePoint"
    ],
    description: "Genera y distribuye el reporte financiero diario automaticamente"
  },
  {
    id: "WF-003",
    name: "Alerta de Stock Bajo",
    trigger: "Evento - Inventario",
    status: "activo",
    executions: 89,
    lastRun: "2026-02-10 07:15",
    successRate: 100,
    steps: [
      "Monitorear niveles de inventario",
      "Detectar items bajo minimo",
      "Consultar proveedores en SAGE X3",
      "Generar orden de compra",
      "Notificar al departamento"
    ],
    description: "Detecta niveles bajos de stock y genera ordenes de compra automaticamente"
  },
  {
    id: "WF-004",
    name: "Encuesta Post-Estancia",
    trigger: "Webhook - Check-out",
    status: "activo",
    executions: 2340,
    lastRun: "2026-02-10 11:00",
    successRate: 96.2,
    steps: [
      "Detectar check-out completado",
      "Esperar 24 horas",
      "Enviar encuesta por email",
      "Recopilar respuestas",
      "Analizar con Python (NLP)",
      "Actualizar score del huesped"
    ],
    description: "Envio automatico de encuestas de satisfaccion y analisis de sentimiento"
  },
  {
    id: "WF-005",
    name: "Sync Tarifas OTAs",
    trigger: "Cron - cada 15 min",
    status: "pausado",
    executions: 8920,
    lastRun: "2026-02-10 08:45",
    successRate: 94.8,
    steps: [
      "Obtener tarifas actuales",
      "Calcular precio optimo (Python ML)",
      "Actualizar en Booking.com",
      "Actualizar en Expedia",
      "Actualizar en canal directo",
      "Registrar en SAGE X3"
    ],
    description: "Sincronizacion de tarifas dinamicas con OTAs basada en demanda"
  },
]

export const pythonScripts = [
  {
    name: "revenue_forecast.py",
    description: "Prediccion de ingresos usando regresion lineal y datos historicos de SAGE X3",
    language: "Python 3.11",
    libraries: ["pandas", "scikit-learn", "matplotlib"],
    lastRun: "2026-02-10 06:00",
    status: "completado",
    code: `import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Conexion a SAGE X3 via ODBC
def get_revenue_data():
    """Obtiene datos historicos de ingresos desde SAGE X3"""
    query = """
        SELECT FECHA, INGRESOS_TOTAL, OCUPACION,
               TARIFA_PROMEDIO, NUM_RESERVAS
        FROM HOTEL_REVENUE_HIST
        WHERE FECHA >= DATEADD(year, -2, GETDATE())
        ORDER BY FECHA
    """
    # df = pd.read_sql(query, sage_connection)
    # Simulacion con datos de ejemplo
    dates = pd.date_range('2024-01-01', '2026-02-09')
    np.random.seed(42)
    df = pd.DataFrame({
        'fecha': dates,
        'ingresos': np.random.normal(5000, 800, len(dates)),
        'ocupacion': np.random.uniform(0.55, 0.98, len(dates)),
        'tarifa_promedio': np.random.normal(185, 25, len(dates))
    })
    return df

def train_model(df):
    """Entrena modelo de prediccion de ingresos"""
    X = df[['ocupacion', 'tarifa_promedio']].values
    y = df['ingresos'].values
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    
    print(f"R2 Score: {score:.4f}")
    return model

def forecast_next_month(model):
    """Genera prediccion para el proximo mes"""
    # Escenarios: conservador, esperado, optimista
    scenarios = {
        'conservador': [0.65, 170],
        'esperado': [0.78, 185],
        'optimista': [0.92, 210]
    }
    
    results = {}
    for name, features in scenarios.items():
        prediction = model.predict([features])[0]
        results[name] = round(prediction * 30, 2)
    
    return results

if __name__ == "__main__":
    df = get_revenue_data()
    model = train_model(df)
    forecast = forecast_next_month(model)
    print("Pronostico mensual:", forecast)`
  },
  {
    name: "guest_sentiment.py",
    description: "Analisis de sentimiento de resenas de huespedes con NLP",
    language: "Python 3.11",
    libraries: ["nltk", "textblob", "pandas"],
    lastRun: "2026-02-10 08:00",
    status: "completado",
    code: `from textblob import TextBlob
import pandas as pd

def analyze_reviews(reviews):
    """Analiza sentimiento de resenas de huespedes"""
    results = []
    for review in reviews:
        blob = TextBlob(review['texto'])
        sentiment = blob.sentiment
        
        results.append({
            'huesped': review['huesped'],
            'polaridad': round(sentiment.polarity, 2),
            'subjetividad': round(sentiment.subjectivity, 2),
            'clasificacion': classify(sentiment.polarity),
            'keywords': extract_keywords(review['texto'])
        })
    
    return pd.DataFrame(results)

def classify(polarity):
    if polarity > 0.3: return "Positivo"
    elif polarity < -0.1: return "Negativo"
    else: return "Neutral"

def extract_keywords(text):
    """Extrae palabras clave relevantes"""
    blob = TextBlob(text)
    return [word for word, tag in blob.tags 
            if tag.startswith('JJ') or tag.startswith('NN')]

# Ejemplo de uso
reviews = [
    {"huesped": "Carlos M.", "texto": "Excellent service and beautiful rooms"},
    {"huesped": "Ana G.", "texto": "Room was clean but check-in was slow"},
    {"huesped": "John S.", "texto": "Amazing spa, will definitely come back"}
]

df = analyze_reviews(reviews)
print(df.to_string())`
  },
  {
    name: "inventory_optimizer.py",
    description: "Optimizacion de inventario de suministros hoteleros",
    language: "Python 3.11",
    libraries: ["pandas", "scipy", "numpy"],
    lastRun: "2026-02-09 22:00",
    status: "completado",
    code: `import numpy as np
import pandas as pd
from scipy.optimize import minimize

def calculate_eoq(demand, order_cost, holding_cost):
    """Calcula la Cantidad Economica de Pedido (EOQ)"""
    eoq = np.sqrt((2 * demand * order_cost) / holding_cost)
    return round(eoq)

def optimize_inventory():
    """Optimiza niveles de inventario para suministros del hotel"""
    items = pd.DataFrame({
        'item': ['Amenities', 'Toallas', 'Sabanas', 
                 'Minibar', 'Productos limpieza'],
        'demanda_mensual': [3000, 500, 300, 1200, 800],
        'costo_pedido': [50, 120, 150, 80, 60],
        'costo_almacen': [0.5, 2.0, 3.0, 1.0, 0.8],
        'precio_unitario': [2.5, 15, 25, 8, 5]
    })
    
    items['eoq'] = items.apply(
        lambda r: calculate_eoq(
            r['demanda_mensual'], 
            r['costo_pedido'], 
            r['costo_almacen']
        ), axis=1
    )
    
    items['punto_reorden'] = (
        items['demanda_mensual'] / 30 * 5  # Lead time 5 dias
    ).round()
    
    items['costo_anual'] = (
        items['demanda_mensual'] * 12 * items['precio_unitario']
    )
    
    return items

if __name__ == "__main__":
    result = optimize_inventory()
    print(result.to_string())
    print(f"\\nCosto total anual: \${result['costo_anual'].sum():,.2f}")`
  }
]

export const officeReports = [
  {
    name: "Reporte Mensual de Ocupacion",
    type: "Excel",
    icon: "spreadsheet",
    downloadKey: "ocupacion",
    description: "Analisis detallado de tasas de ocupacion por tipo de habitacion, canal de venta y temporada. Incluye tablas dinamicas y graficos.",
    features: ["Tablas dinamicas", "Graficos de tendencia", "Formato condicional", "Macros VBA"],
    lastGenerated: "2026-02-01",
    formula: '=SUMPRODUCT((B2:B366="Suite")*(C2:C366>=0.8))/COUNTIF(B2:B366,"Suite")'
  },
  {
    name: "Dashboard Financiero",
    type: "Excel",
    icon: "spreadsheet",
    downloadKey: "financiero",
    description: "Cuadro de mando con KPIs financieros, comparativa presupuesto vs real, y proyecciones trimestrales.",
    features: ["Power Query desde SAGE X3", "Modelo de datos", "KPIs automaticos", "Slicers interactivos"],
    lastGenerated: "2026-02-05",
    formula: '=IFERROR(INDEX(Ingresos,MATCH(1,(Mes=A2)*(Depto=B2),0)),0)'
  },
  {
    name: "Informe de Gestion para Directiva",
    type: "Excel",
    icon: "presentation",
    downloadKey: "directiva",
    description: "Informe ejecutivo con resultados del mes, indicadores clave y plan de accion.",
    features: ["Resumen KPIs", "Plan de accion", "Prioridades", "Responsables"],
    lastGenerated: "2026-02-03",
    formula: null
  },
  {
    name: "Control de Proveedores",
    type: "Excel",
    icon: "spreadsheet",
    downloadKey: "proveedores",
    description: "Base de datos de proveedores con evaluaciones, historial de compras y condiciones comerciales.",
    features: ["Validacion de datos", "Buscarv automatico", "Alertas de vencimiento", "Importacion SAGE X3"],
    lastGenerated: "2026-02-08",
    formula: '=VLOOKUP(A2,Proveedores!A:F,4,FALSE)'
  },
  {
    name: "Planificacion de Turnos",
    type: "Excel",
    icon: "spreadsheet",
    downloadKey: "turnos",
    description: "Calendario de turnos del personal con calculo automatico de horas extras y cobertura minima.",
    features: ["Solver para optimizacion", "Macros de autoasignacion", "Calendario visual", "Costos por turno"],
    lastGenerated: "2026-02-09",
    formula: '=IF(COUNTIF(Turnos!B:B,A2)>=3,"Cobertura OK","ALERTA")'
  },
]
