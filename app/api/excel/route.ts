import { NextRequest, NextResponse } from "next/server"
import ExcelJS from "exceljs"

const REPORTS: Record<string, () => Promise<ExcelJS.Workbook>> = {
  "ocupacion": generateOccupancyReport,
  "financiero": generateFinancialReport,
  "proveedores": generateSupplierReport,
  "turnos": generateShiftReport,
  "directiva": generateExecutiveReport,
}

export async function GET(request: NextRequest) {
  const reportType = request.nextUrl.searchParams.get("report")

  if (!reportType || !REPORTS[reportType]) {
    return NextResponse.json({ error: "Tipo de reporte no valido" }, { status: 400 })
  }

  try {
    const workbook = await REPORTS[reportType]()
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="hotel_${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error generando reporte"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── Styling helpers ──

function headerStyle(worksheet: ExcelJS.Worksheet, row: number, colCount: number) {
  const headerRow = worksheet.getRow(row)
  for (let i = 1; i <= colCount; i++) {
    const cell = headerRow.getCell(i)
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B6EC2" } }
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF1B6EC2" } },
    }
  }
  headerRow.height = 28
}

function titleRow(worksheet: ExcelJS.Worksheet, title: string, colSpan: number) {
  const row = worksheet.addRow([title])
  worksheet.mergeCells(row.number, 1, row.number, colSpan)
  const cell = row.getCell(1)
  cell.font = { bold: true, size: 16, color: { argb: "FF1B6EC2" } }
  cell.alignment = { horizontal: "left", vertical: "middle" }
  row.height = 32
  worksheet.addRow([])
}

function subtitleRow(worksheet: ExcelJS.Worksheet, subtitle: string, colSpan: number) {
  const row = worksheet.addRow([subtitle])
  worksheet.mergeCells(row.number, 1, row.number, colSpan)
  const cell = row.getCell(1)
  cell.font = { italic: true, size: 10, color: { argb: "FF666666" } }
  worksheet.addRow([])
}

// ── Report Generators ──

async function generateOccupancyReport() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Hotel Management System - SAGE X3"
  workbook.created = new Date()

  // Sheet 1: Monthly Summary
  const ws1 = workbook.addWorksheet("Resumen Mensual", { properties: { tabColor: { argb: "FF1B6EC2" } } })
  titleRow(ws1, "Reporte de Ocupacion Hotelera 2026", 6)
  subtitleRow(ws1, `Generado: ${new Date().toLocaleDateString("es-ES")} | Fuente: SAGE X3 ERP`, 6)

  ws1.columns = [
    { header: "Mes", key: "mes", width: 14 },
    { header: "Ocupacion %", key: "ocupacion", width: 14 },
    { header: "Habitaciones Vendidas", key: "vendidas", width: 22 },
    { header: "ADR ($)", key: "adr", width: 12 },
    { header: "RevPAR ($)", key: "revpar", width: 14 },
    { header: "Ingresos ($)", key: "ingresos", width: 16 },
  ]

  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  const occupancies = [65, 72, 78, 75, 82, 88, 95, 93, 80, 76, 70, 85]
  const revenues = [98500, 112000, 135000, 128000, 145000, 168000, 195000, 189000, 152000, 138000, 125000, 160000]
  const dataStartRow = ws1.rowCount + 1

  ws1.addRow(["Mes", "Ocupacion %", "Hab. Vendidas", "ADR ($)", "RevPAR ($)", "Ingresos ($)"])
  headerStyle(ws1, ws1.rowCount, 6)

  months.forEach((m, i) => {
    const sold = Math.round(250 * occupancies[i] / 100)
    const adr = Math.round(revenues[i] / sold / 30)
    const revpar = Math.round(revenues[i] / 250 / 30)
    const row = ws1.addRow([m, occupancies[i], sold, adr, revpar, revenues[i]])

    // Conditional formatting for occupancy
    const occCell = row.getCell(2)
    if (occupancies[i] >= 85) {
      occCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD4EDDA" } }
      occCell.font = { color: { argb: "FF155724" }, bold: true }
    } else if (occupancies[i] < 70) {
      occCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8D7DA" } }
      occCell.font = { color: { argb: "FF721C24" } }
    }

    // Number formatting
    row.getCell(4).numFmt = "$#,##0"
    row.getCell(5).numFmt = "$#,##0"
    row.getCell(6).numFmt = "$#,##0"
  })

  // Totals
  ws1.addRow([])
  const totalRow = ws1.addRow([
    "PROMEDIO/TOTAL",
    `=AVERAGE(B${dataStartRow + 1}:B${dataStartRow + 12})`,
    `=SUM(C${dataStartRow + 1}:C${dataStartRow + 12})`,
    `=AVERAGE(D${dataStartRow + 1}:D${dataStartRow + 12})`,
    `=AVERAGE(E${dataStartRow + 1}:E${dataStartRow + 12})`,
    `=SUM(F${dataStartRow + 1}:F${dataStartRow + 12})`,
  ])
  for (let c = 1; c <= 6; c++) {
    totalRow.getCell(c).font = { bold: true, size: 11 }
    totalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F4F8" } }
  }
  totalRow.getCell(4).numFmt = "$#,##0"
  totalRow.getCell(5).numFmt = "$#,##0"
  totalRow.getCell(6).numFmt = "$#,##0"

  // Sheet 2: Room Type Breakdown
  const ws2 = workbook.addWorksheet("Por Tipo de Habitacion", { properties: { tabColor: { argb: "FF28A745" } } })
  titleRow(ws2, "Ocupacion por Tipo de Habitacion", 5)
  ws2.columns = [
    { header: "Tipo", key: "tipo", width: 18 },
    { header: "Cantidad", key: "cantidad", width: 12 },
    { header: "Tarifa ($)", key: "tarifa", width: 14 },
    { header: "Ocupacion %", key: "ocupacion", width: 14 },
    { header: "Revenue ($)", key: "revenue", width: 16 },
  ]
  ws2.addRow(["Tipo", "Cantidad", "Tarifa ($)", "Ocupacion %", "Revenue ($)"])
  headerStyle(ws2, ws2.rowCount, 5)

  const rooms = [
    { tipo: "Individual", cantidad: 80, tarifa: 120, ocupacion: 85 },
    { tipo: "Doble", cantidad: 90, tarifa: 175, ocupacion: 78 },
    { tipo: "Suite Jr.", cantidad: 45, tarifa: 280, ocupacion: 72 },
    { tipo: "Suite", cantidad: 25, tarifa: 450, ocupacion: 65 },
    { tipo: "Presidencial", cantidad: 10, tarifa: 850, ocupacion: 55 },
  ]
  rooms.forEach((r) => {
    const rev = Math.round(r.cantidad * r.tarifa * r.ocupacion / 100 * 30)
    const row = ws2.addRow([r.tipo, r.cantidad, r.tarifa, r.ocupacion, rev])
    row.getCell(3).numFmt = "$#,##0"
    row.getCell(5).numFmt = "$#,##0"
  })

  return workbook
}

async function generateFinancialReport() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Hotel Management System - SAGE X3"

  const ws = workbook.addWorksheet("Dashboard Financiero", { properties: { tabColor: { argb: "FF1B6EC2" } } })
  titleRow(ws, "Dashboard Financiero - Hotel Grand Resort 2026", 6)
  subtitleRow(ws, `Fuente: SAGE X3 Contabilidad General | ${new Date().toLocaleDateString("es-ES")}`, 6)

  // KPIs Section
  ws.addRow(["INDICADORES CLAVE DE RENDIMIENTO (KPIs)"])
  const kpiHeaderRow = ws.getRow(ws.rowCount)
  ws.mergeCells(kpiHeaderRow.number, 1, kpiHeaderRow.number, 6)
  kpiHeaderRow.getCell(1).font = { bold: true, size: 12, color: { argb: "FF1B6EC2" } }
  ws.addRow([])

  const kpis = [
    ["Tasa de Ocupacion", "78.5%", "RevPAR", "$145.23"],
    ["ADR (Tarifa Promedio)", "$185.00", "GOP Margin", "42.3%"],
    ["Total Ingresos YTD", "$1,245,680", "Meta Anual", "$1,500,000"],
    ["Satisfaccion Huesped", "4.6 / 5.0", "NPS Score", "72"],
  ]

  kpis.forEach((row) => {
    const r = ws.addRow(row)
    r.getCell(1).font = { bold: true, color: { argb: "FF333333" } }
    r.getCell(3).font = { bold: true, color: { argb: "FF333333" } }
    r.getCell(2).font = { bold: true, color: { argb: "FF1B6EC2" }, size: 12 }
    r.getCell(4).font = { bold: true, color: { argb: "FF1B6EC2" }, size: 12 }
  })

  ws.addRow([])
  ws.addRow([])

  // Department Budget vs Actual
  ws.addRow(["PRESUPUESTO VS. REAL POR DEPARTAMENTO"])
  const deptHeaderRow = ws.getRow(ws.rowCount)
  ws.mergeCells(deptHeaderRow.number, 1, deptHeaderRow.number, 6)
  deptHeaderRow.getCell(1).font = { bold: true, size: 12, color: { argb: "FF1B6EC2" } }
  ws.addRow([])

  ws.columns = [
    { width: 20 }, { width: 16 }, { width: 16 },
    { width: 14 }, { width: 14 }, { width: 18 },
  ]

  ws.addRow(["Departamento", "Presupuesto ($)", "Real ($)", "Variacion %", "Estado", "Comentario"])
  headerStyle(ws, ws.rowCount, 6)

  const departments = [
    { dept: "Recepcion", budget: 45000, actual: 42300, variation: -6 },
    { dept: "Housekeeping", budget: 38000, actual: 41200, variation: 8.4 },
    { dept: "F&B", budget: 62000, actual: 58900, variation: -5 },
    { dept: "Mantenimiento", budget: 28000, actual: 29500, variation: 5.4 },
    { dept: "Marketing", budget: 22000, actual: 19800, variation: -10 },
    { dept: "Spa & Wellness", budget: 18000, actual: 17200, variation: -4.4 },
  ]

  departments.forEach((d) => {
    const status = d.variation > 5 ? "SOBRE PRESUPUESTO" : d.variation < -5 ? "AHORRO" : "EN RANGO"
    const comment = d.variation > 5 ? "Requiere revision" : d.variation < -5 ? "Buen control" : "Normal"
    const row = ws.addRow([d.dept, d.budget, d.actual, d.variation, status, comment])
    row.getCell(2).numFmt = "$#,##0"
    row.getCell(3).numFmt = "$#,##0"
    row.getCell(4).numFmt = "0.0%"
    row.getCell(4).value = d.variation / 100

    if (d.variation > 5) {
      row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8D7DA" } }
      row.getCell(5).font = { bold: true, color: { argb: "FF721C24" } }
    } else if (d.variation < -5) {
      row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD4EDDA" } }
      row.getCell(5).font = { bold: true, color: { argb: "FF155724" } }
    }
  })

  return workbook
}

async function generateSupplierReport() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Hotel Management System - SAGE X3"

  const ws = workbook.addWorksheet("Proveedores", { properties: { tabColor: { argb: "FFFD7E14" } } })
  titleRow(ws, "Control de Proveedores - SAGE X3", 7)
  subtitleRow(ws, `Modulo: Gestion de Compras | ${new Date().toLocaleDateString("es-ES")}`, 7)

  ws.columns = [
    { width: 8 }, { width: 24 }, { width: 20 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 16 },
  ]

  ws.addRow(["ID", "Proveedor", "Categoria", "Evaluacion", "Ultimo Pedido", "Monto YTD ($)", "Estado"])
  headerStyle(ws, ws.rowCount, 7)

  const suppliers = [
    { id: "PROV-001", name: "Textiles del Sur", cat: "Lenceria", eval: 4.5, last: "2026-02-05", amount: 45200, status: "Activo" },
    { id: "PROV-002", name: "Alimentos Premium SA", cat: "F&B", eval: 4.8, last: "2026-02-09", amount: 128000, status: "Activo" },
    { id: "PROV-003", name: "CleanPro Industrial", cat: "Limpieza", eval: 3.9, last: "2026-01-28", amount: 22400, status: "Activo" },
    { id: "PROV-004", name: "TechHotel Solutions", cat: "Tecnologia", eval: 4.2, last: "2026-01-15", amount: 35800, status: "Activo" },
    { id: "PROV-005", name: "Amenidades Luxe", cat: "Amenities", eval: 4.7, last: "2026-02-08", amount: 18900, status: "Activo" },
    { id: "PROV-006", name: "Bebidas & Mas", cat: "Minibar", eval: 3.2, last: "2025-12-20", amount: 8500, status: "En revision" },
    { id: "PROV-007", name: "Muebles Hogar", cat: "Mobiliario", eval: 4.0, last: "2025-11-10", amount: 67000, status: "Activo" },
  ]

  suppliers.forEach((s) => {
    const row = ws.addRow([s.id, s.name, s.cat, s.eval, s.last, s.amount, s.status])
    row.getCell(6).numFmt = "$#,##0"

    if (s.eval >= 4.5) {
      row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD4EDDA" } }
    } else if (s.eval < 3.5) {
      row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8D7DA" } }
    }

    if (s.status === "En revision") {
      row.getCell(7).font = { color: { argb: "FFFD7E14" }, bold: true }
    }
  })

  return workbook
}

async function generateShiftReport() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Hotel Management System - SAGE X3"

  const ws = workbook.addWorksheet("Turnos Semana", { properties: { tabColor: { argb: "FF6F42C1" } } })
  titleRow(ws, "Planificacion de Turnos - Semana del 10-16 Feb 2026", 9)
  subtitleRow(ws, `Modulo: RRHH SAGE X3 | Departamento: Recepcion`, 9)

  ws.columns = [
    { width: 18 }, { width: 12 }, { width: 12 }, { width: 12 },
    { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 14 },
  ]

  ws.addRow(["Empleado", "Lun 10", "Mar 11", "Mie 12", "Jue 13", "Vie 14", "Sab 15", "Dom 16", "Total Horas"])
  headerStyle(ws, ws.rowCount, 9)

  const shifts = { "M": "Manana", "T": "Tarde", "N": "Noche", "L": "Libre" }
  const hoursMap: Record<string, number> = { "M": 8, "T": 8, "N": 8, "L": 0 }

  const staff = [
    { name: "Rodriguez, Ana", shifts: ["M", "M", "M", "T", "T", "L", "L"] },
    { name: "Martinez, Carlos", shifts: ["T", "T", "N", "N", "L", "L", "M"] },
    { name: "Garcia, Laura", shifts: ["N", "L", "L", "M", "M", "M", "T"] },
    { name: "Lopez, Pedro", shifts: ["L", "L", "T", "T", "N", "N", "N"] },
    { name: "Sanchez, Maria", shifts: ["M", "T", "M", "L", "L", "T", "M"] },
    { name: "Fernandez, Juan", shifts: ["T", "N", "N", "N", "M", "M", "L"] },
  ]

  const shiftColors: Record<string, string> = {
    "M": "FFD4EDDA",
    "T": "FFFFF3CD",
    "N": "FFD6D8DB",
    "L": "FFFFFFFF",
  }

  staff.forEach((s) => {
    const totalHrs = s.shifts.reduce((sum, sh) => sum + hoursMap[sh], 0)
    const row = ws.addRow([s.name, ...s.shifts.map((sh) => shifts[sh as keyof typeof shifts]), totalHrs])
    row.getCell(1).font = { bold: true }

    for (let c = 2; c <= 8; c++) {
      const shiftKey = s.shifts[c - 2]
      row.getCell(c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: shiftColors[shiftKey] },
      }
      row.getCell(c).alignment = { horizontal: "center" }
    }

    row.getCell(9).font = { bold: true }
    if (totalHrs > 40) {
      row.getCell(9).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8D7DA" } }
      row.getCell(9).font = { bold: true, color: { argb: "FF721C24" } }
    }
  })

  ws.addRow([])
  const legendRow = ws.addRow(["Leyenda:", "Manana (06-14)", "Tarde (14-22)", "Noche (22-06)", "Libre"])
  legendRow.getCell(1).font = { bold: true, italic: true }

  return workbook
}

async function generateExecutiveReport() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Hotel Management System"

  const ws = workbook.addWorksheet("Informe Directiva", { properties: { tabColor: { argb: "FFDC3545" } } })
  titleRow(ws, "Informe de Gestion para Directiva - Febrero 2026", 4)
  subtitleRow(ws, "Hotel Grand Resort | Confidencial", 4)

  ws.columns = [{ width: 28 }, { width: 18 }, { width: 18 }, { width: 22 }]

  // Section 1: Executive Summary
  ws.addRow(["RESUMEN EJECUTIVO"]).getCell(1).font = { bold: true, size: 12, color: { argb: "FF1B6EC2" } }
  ws.addRow([])
  ws.addRow(["Indicador", "Actual", "Meta", "Tendencia"])
  headerStyle(ws, ws.rowCount, 4)

  const kpis = [
    ["Ocupacion General", "78.5%", "80%", "En mejora"],
    ["Ingresos Totales", "$1,245,680", "$1,500,000", "83% de meta"],
    ["Satisfaccion (NPS)", "72", "75", "Estable"],
    ["RevPAR", "$145.23", "$160", "En mejora"],
    ["Costo por Habitacion", "$42.50", "$40", "Requiere atencion"],
  ]
  kpis.forEach((k) => {
    const row = ws.addRow(k)
    row.getCell(1).font = { bold: true }
  })

  ws.addRow([])
  ws.addRow([])

  // Section 2: Action Items
  ws.addRow(["PLAN DE ACCION"]).getCell(1).font = { bold: true, size: 12, color: { argb: "FF1B6EC2" } }
  ws.addRow([])
  ws.addRow(["Accion", "Responsable", "Fecha Limite", "Prioridad"])
  headerStyle(ws, ws.rowCount, 4)

  const actions = [
    ["Campaña marketing temporada baja", "Dpto. Marketing", "2026-03-01", "Alta"],
    ["Renovacion habitaciones piso 3", "Dpto. Mantenimiento", "2026-04-15", "Media"],
    ["Negociacion tarifas OTAs", "Revenue Manager", "2026-02-28", "Alta"],
    ["Capacitacion servicio al cliente", "RRHH", "2026-03-10", "Media"],
    ["Implementar check-in digital", "TI", "2026-05-01", "Baja"],
  ]
  actions.forEach((a) => {
    const row = ws.addRow(a)
    if (a[3] === "Alta") {
      row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8D7DA" } }
      row.getCell(4).font = { bold: true, color: { argb: "FF721C24" } }
    }
  })

  return workbook
}
