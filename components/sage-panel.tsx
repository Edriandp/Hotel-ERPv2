"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sageX3Modules, departmentExpenses } from "@/lib/hotel-data"
import { cn } from "@/lib/utils"
import {
  Database,
  RefreshCw,
  CheckCircle2,
  Loader2,
  ArrowDownRight,
  ArrowUpRight,
  Server,
  Link2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  activo: { icon: CheckCircle2, color: "text-accent", label: "Activo" },
  sincronizando: { icon: Loader2, color: "text-primary", label: "Sincronizando" },
  error: { icon: RefreshCw, color: "text-destructive", label: "Error" },
}

export function SagePanel() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">ERP Hotelero</h2>
            <p className="text-sm text-muted-foreground">
              Integracion con modulos de gestion empresarial
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Servidor</p>
                <p className="text-xs text-muted-foreground font-mono">hotelgrandresort.com:8124</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link2 className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Conectado</span>
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                v12.0.28
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Modulos Activos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sageX3Modules.map((mod) => {
            const config = statusConfig[mod.status]
            const StatusIcon = config.icon
            return (
              <Card key={mod.module} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-card-foreground">{mod.module}</h4>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon
                        className={cn(
                          "w-3.5 h-3.5",
                          config.color,
                          mod.status === "sincronizando" && "animate-spin"
                        )}
                      />
                      <span className={cn("text-xs font-medium", config.color)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{mod.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {mod.records.toLocaleString()} registros
                    </span>
                    <span className="text-muted-foreground font-mono">
                      Sync: {mod.lastSync}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Department Budget vs Actual */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-card-foreground">
            Presupuesto vs Real por Departamento
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Datos del modulo de Contabilidad General
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentExpenses} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="departamento"
                  tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 15%, 88%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="presupuesto" name="Presupuesto" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="real" name="Real" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Variance Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">
            Analisis de Variaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Departamento</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Presupuesto</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Real</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Variacion</th>
                </tr>
              </thead>
              <tbody>
                {departmentExpenses.map((dept) => (
                  <tr key={dept.departamento} className="border-b border-border/50">
                    <td className="py-2.5 px-3 font-medium text-card-foreground">{dept.departamento}</td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">${dept.presupuesto.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-card-foreground font-medium">${dept.real.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {dept.variacion < 0 ? (
                          <ArrowDownRight className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-destructive" />
                        )}
                        <span className={cn(
                          "text-sm font-medium",
                          dept.variacion < 0 ? "text-accent" : "text-destructive"
                        )}>
                          {dept.variacion > 0 ? "+" : ""}{dept.variacion}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
