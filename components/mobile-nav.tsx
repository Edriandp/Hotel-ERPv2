"use client"

import React from "react"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Code2,
  FileSpreadsheet,
  Menu,
  X,
  Hotel,
} from "lucide-react"
import { useState } from "react"

type Section = "dashboard" | "sage" | "n8n" | "python" | "office"

interface MobileNavProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sage", label: "SAGE X3", icon: Database },
  { id: "n8n", label: "N8N", icon: GitBranch },
  { id: "python", label: "Python", icon: Code2 },
  { id: "office", label: "Ofimatica", icon: FileSpreadsheet },
]

export function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-muted transition-colors"
        aria-label="Abrir menu de navegacion"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-foreground/40 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false)
            }}
            role="button"
            tabIndex={-1}
            aria-label="Cerrar menu"
          />
          <nav className="fixed top-0 left-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground z-50 flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sidebar-primary">
                  <Hotel className="w-3.5 h-3.5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-sidebar-primary-foreground">
                  Hotel Grand Resort
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors"
                aria-label="Cerrar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 p-2 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSectionChange(item.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 w-full",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
