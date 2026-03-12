"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { KPICards } from "@/components/kpi-cards"
import { RevenueChart } from "@/components/revenue-chart"
import { OccupancyChart } from "@/components/occupancy-chart"
import { ReservationsTable } from "@/components/reservations-table"
import { SagePanel } from "@/components/sage-panel"
import { N8NPanel } from "@/components/n8n-panel"
import { PythonPanel } from "@/components/python-panel"
import { OfficePanel } from "@/components/office-panel"
import { MobileNav } from "@/components/mobile-nav"
import { Calendar, Bell } from "lucide-react"

type Section = "dashboard" | "sage" | "n8n" | "python" | "office"

const sectionTitles: Record<Section, string> = {
  dashboard: "Panel de Control",
  sage: "ERP Hotelero",
  n8n: "Workflows",
  python: "Python Analytics",
  office: "Ofimatica",
}

export default function HotelDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />
            <div>
              <h1 className="text-lg font-bold text-card-foreground">
                {sectionTitles[activeSection]}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Hotel Grand Resort - Sistema Integrado de Gestion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span>10 Feb 2026</span>
            </div>
            <button
              type="button"
              className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {activeSection === "dashboard" && (
            <div className="flex flex-col gap-6">
              <KPICards />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <OccupancyChart />
              </div>
              <ReservationsTable />
            </div>
          )}
          {activeSection === "sage" && <SagePanel />}
          {activeSection === "n8n" && <N8NPanel />}
          {activeSection === "python" && <PythonPanel />}
          {activeSection === "office" && <OfficePanel />}
        </div>
      </main>
    </div>
  )
}
