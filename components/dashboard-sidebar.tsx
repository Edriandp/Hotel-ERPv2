"use client"

import React from "react"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Code2,
  FileSpreadsheet,
  Hotel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

type Section = "dashboard" | "sage" | "n8n" | "python" | "office"

interface DashboardSidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

const navItems: { id: Section; label: string; icon: React.ElementType; sublabel: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, sublabel: "KPIs y Metricas" },
  { id: "sage", label: "ERP", icon: Database, sublabel: "ERP Hotelero" },
  { id: "n8n", label: "Workflows", icon: GitBranch, sublabel: "Automatizaciones" },
  { id: "python", label: "Python", icon: Code2, sublabel: "Analytics & ML" },
  { id: "office", label: "Ofimatica", icon: FileSpreadsheet, sublabel: "Reportes Avanzados" },
]

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
          <Hotel className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-sidebar-primary-foreground truncate">
              Hotel Grand Resort
            </span>
            <span className="text-xs text-sidebar-foreground/60 truncate">
              Sistema de Gestion
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 w-full",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{item.label}</span>
                  <span className={cn(
                    "text-xs truncate",
                    isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/50"
                  )}>
                    {item.sublabel}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
