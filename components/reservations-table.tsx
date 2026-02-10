"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { recentReservations } from "@/lib/hotel-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusStyles: Record<string, string> = {
  confirmada: "bg-primary/10 text-primary border-primary/20",
  "check-in": "bg-accent/10 text-accent border-accent/20",
  pendiente: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "check-out": "bg-muted text-muted-foreground border-border",
}

const statusLabels: Record<string, string> = {
  confirmada: "Confirmada",
  "check-in": "Check-in",
  pendiente: "Pendiente",
  "check-out": "Check-out",
}

export function ReservationsTable() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Reservaciones Recientes
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Modulo de Facturacion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Huesped</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Habitacion</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-in</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-out</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((res) => (
                <tr key={res.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{res.id}</td>
                  <td className="py-2.5 px-3 font-medium text-card-foreground">{res.guest}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{res.room}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{res.checkIn}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{res.checkOut}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{res.source}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-card-foreground">${res.total.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className={cn("text-xs font-medium", statusStyles[res.status])}>
                      {statusLabels[res.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
