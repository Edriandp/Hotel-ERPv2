"use client"

import React, { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { officeReports } from "@/lib/hotel-data"
import { cn } from "@/lib/utils"
import {
  FileSpreadsheet,
  Presentation,
  CheckCircle2,
  Download,
  BarChart3,
  Calculator,
  FunctionSquare,
  Loader2,
  AlertCircle,
  FileDown,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
}

const skills = [
  {
    category: "Excel Avanzado",
    icon: FileSpreadsheet,
    items: [
      "Tablas dinamicas y segmentaciones",
      "Funciones avanzadas (BUSCARV, INDICE/COINCIDIR, SUMAPRODUCTO)",
      "Power Query para ETL desde SAGE X3",
      "Macros VBA para automatizacion",
      "Formato condicional y validacion de datos",
      "Solver para optimizacion",
    ],
  },
  {
    category: "Power BI / Visualizacion",
    icon: BarChart3,
    items: [
      "Dashboards interactivos",
      "Conexion directa a SAGE X3",
      "Modelo de datos relacional",
      "DAX para medidas calculadas",
      "Publicacion y comparticion",
    ],
  },
  {
    category: "PowerPoint Corporativo",
    icon: Presentation,
    items: [
      "Presentaciones ejecutivas",
      "Graficos vinculados a Excel en tiempo real",
      "Plantillas corporativas del hotel",
      "Exportacion automatizada a PDF",
    ],
  },
  {
    category: "Automatizacion Office",
    icon: Calculator,
    items: [
      "Office Scripts para Excel Online",
      "Power Automate (flujos con N8N)",
      "Sharepoint para gestion documental",
      "Integracion con Teams para alertas",
    ],
  },
]

export function OfficePanel() {
  const [selectedReport, setSelectedReport] = useState(officeReports[0])
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  const handleDownload = useCallback(async (reportKey: string, reportName: string) => {
    setDownloading(reportKey)
    setDownloadError(null)
    setDownloadSuccess(null)

    try {
      const res = await fetch(`/api/excel?report=${reportKey}`)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error generando el reporte")
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `hotel_${reportKey}_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDownloadSuccess(reportName)

      setTimeout(() => setDownloadSuccess(null), 3000)
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Error descargando reporte"
      )
    } finally {
      setDownloading(null)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Ofimatica - Nivel Avanzado
            </h2>
            <p className="text-sm text-muted-foreground">
              Reportes descargables en Excel real, generados con ExcelJS desde
              datos de SAGE X3
            </p>
          </div>
        </div>
      </div>

      {/* Success / Error toast */}
      {downloadSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            <span className="font-medium">{downloadSuccess}</span> descargado
            correctamente. Abre el archivo .xlsx en Excel para verlo.
          </span>
        </div>
      )}
      {downloadError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon
          return (
            <Card key={skill.category} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold text-card-foreground">
                    {skill.category}
                  </h4>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reports Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
          Reportes Generados -- Descarga Real en .xlsx
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Report List */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {officeReports.map((report) => {
              const ReportIcon = iconMap[report.icon]
              return (
                <button
                  key={report.name}
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all duration-200",
                    selectedReport.name === report.name
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ReportIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">
                      {report.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="text-xs bg-muted text-muted-foreground border-border"
                    >
                      {report.type}
                    </Badge>
                    <span>{report.lastGenerated}</span>
                    {report.downloadKey && (
                      <FileDown className="w-3 h-3 text-accent ml-auto" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Report Detail */}
          <Card className="lg:col-span-3 bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-card-foreground">
                    {selectedReport.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {selectedReport.description}
                  </CardDescription>
                </div>
                <button
                  type="button"
                  disabled={downloading === selectedReport.downloadKey}
                  onClick={() =>
                    handleDownload(
                      selectedReport.downloadKey,
                      selectedReport.name
                    )
                  }
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0",
                    downloading === selectedReport.downloadKey
                      ? "bg-muted text-muted-foreground cursor-wait"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {downloading === selectedReport.downloadKey ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Descargar .xlsx
                    </>
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Features */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                  Funcionalidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="text-xs bg-primary/5 text-primary border-primary/20"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Formula Example */}
              {selectedReport.formula && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FunctionSquare className="w-3.5 h-3.5" />
                    Formula Avanzada de Ejemplo
                  </h4>
                  <div className="rounded-lg overflow-hidden border border-border">
                    <div className="flex items-center gap-2 px-4 py-2 bg-sidebar border-b border-sidebar-border">
                      <div className="w-3 h-3 rounded-full bg-destructive/80" />
                      <div className="w-3 h-3 rounded-full bg-chart-3/80" />
                      <div className="w-3 h-3 rounded-full bg-accent/80" />
                      <span className="text-xs text-sidebar-foreground ml-2 font-mono">
                        Excel - Barra de formulas
                      </span>
                    </div>
                    <pre className="bg-sidebar text-sidebar-foreground p-4 overflow-x-auto text-sm font-mono">
                      <code>{selectedReport.formula}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Integration diagram */}
              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                  Flujo de Datos
                </h4>
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20">
                    SAGE X3
                  </span>
                  <span className="text-muted-foreground">{">"}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent font-medium border border-accent/20">
                    Python ETL
                  </span>
                  <span className="text-muted-foreground">{">"}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-chart-3/10 text-chart-3 font-medium border border-chart-3/20">
                    Excel / Power BI
                  </span>
                  <span className="text-muted-foreground">{">"}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground font-medium border border-border">
                    N8N (Distribucion)
                  </span>
                </div>
              </div>

              {/* Download all reports */}
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Descargar todos los reportes
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Genera y descarga los 5 reportes en formato .xlsx
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!!downloading}
                    onClick={async () => {
                      for (const report of officeReports) {
                        if (report.downloadKey) {
                          await handleDownload(report.downloadKey, report.name)
                          // Small delay between downloads
                          await new Promise((r) => setTimeout(r, 500))
                        }
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      downloading
                        ? "bg-muted text-muted-foreground cursor-wait"
                        : "bg-foreground text-background hover:opacity-90"
                    )}
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Descargar Todos
                      </>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
