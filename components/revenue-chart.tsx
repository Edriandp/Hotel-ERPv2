"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { monthlyRevenue } from "@/lib/hotel-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const CHART_COLORS = {
  ingresos: "#2563eb",
  gastos: "#ef4444",
}

export function RevenueChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Ingresos vs Gastos Mensuales
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Modulo Contabilidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(220, 10%, 45%)" }}
                axisLine={{ stroke: "hsl(220, 15%, 88%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(220, 10%, 45%)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
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
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="ingresos" name="Ingresos" fill={CHART_COLORS.ingresos} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" name="Gastos" fill={CHART_COLORS.gastos} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
