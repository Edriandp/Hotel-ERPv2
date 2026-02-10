"use client"

import { Card, CardContent } from "@/components/ui/card"
import { hotelKPIs } from "@/lib/hotel-data"
import {
  BedDouble,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

const kpis = [
  {
    label: "Tasa de Ocupacion",
    value: `${hotelKPIs.occupancyRate}%`,
    change: "+3.2%",
    positive: true,
    icon: BedDouble,
    detail: `${hotelKPIs.occupiedRooms}/${hotelKPIs.totalRooms} hab.`,
  },
  {
    label: "Tarifa Promedio (ADR)",
    value: `$${hotelKPIs.averageDailyRate}`,
    change: "+5.8%",
    positive: true,
    icon: DollarSign,
    detail: "vs $175 mes anterior",
  },
  {
    label: "RevPAR",
    value: `$${hotelKPIs.revPAR}`,
    change: "+8.1%",
    positive: true,
    icon: TrendingUp,
    detail: "Ingreso por hab. disponible",
  },
  {
    label: "Ingresos del Mes",
    value: `$${(hotelKPIs.totalRevenue / 1000).toFixed(0)}K`,
    change: `${((hotelKPIs.totalRevenue / hotelKPIs.monthlyTarget) * 100).toFixed(0)}% del objetivo`,
    positive: hotelKPIs.totalRevenue >= hotelKPIs.monthlyTarget * 0.8,
    icon: Target,
    detail: `Meta: $${(hotelKPIs.monthlyTarget / 1000).toFixed(0)}K`,
  },
  {
    label: "Check-ins Pendientes",
    value: hotelKPIs.pendingCheckIns.toString(),
    change: "Hoy",
    positive: true,
    icon: Users,
    detail: `${hotelKPIs.pendingCheckOuts} check-outs`,
  },
  {
    label: "Satisfaccion",
    value: `${hotelKPIs.guestSatisfaction}/5.0`,
    change: "+0.2",
    positive: true,
    icon: Star,
    detail: "Promedio general",
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {kpi.label}
                  </span>
                  <span className="text-2xl font-bold text-card-foreground">{kpi.value}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-1.5 py-0.5 rounded",
                        kpi.positive
                          ? "bg-accent/10 text-accent"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{kpi.detail}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
