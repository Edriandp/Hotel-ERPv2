"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { n8nWorkflows } from "@/lib/hotel-data"
import { cn } from "@/lib/utils"
import {
  GitBranch,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Activity,
  Loader2,
  CircleDot,
  Square,
} from "lucide-react"
import { useState, useCallback, useRef } from "react"

type RunState = "idle" | "running" | "done" | "error"

export function N8NPanel() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(n8nWorkflows[0])
  const [runState, setRunState] = useState<RunState>("idle")
  const [currentStep, setCurrentStep] = useState(-1)
  const [stepStatuses, setStepStatuses] = useState<("pending" | "running" | "done" | "error")[]>([])
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalExecutions = n8nWorkflows.reduce((sum, w) => sum + w.executions, 0)
  const avgSuccess = (n8nWorkflows.reduce((sum, w) => sum + w.successRate, 0) / n8nWorkflows.length).toFixed(1)
  const activeCount = n8nWorkflows.filter((w) => w.status === "activo").length

  const simulateRun = useCallback(() => {
    const steps = selectedWorkflow.steps
    setRunState("running")
    setCurrentStep(0)
    setStepStatuses(steps.map(() => "pending"))
    setExecutionLog([`[${new Date().toLocaleTimeString()}] Iniciando workflow: ${selectedWorkflow.name}...`])

    let i = 0
    const runStep = () => {
      if (i >= steps.length) {
        setStepStatuses(steps.map(() => "done"))
        setRunState("done")
        setExecutionLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Workflow completado exitosamente en ${(steps.length * 1.2).toFixed(1)}s`,
        ])
        return
      }
      setCurrentStep(i)
      setStepStatuses(() => steps.map((_, idx) => (idx < i ? "done" : idx === i ? "running" : "pending")))
      setExecutionLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Ejecutando paso ${i + 1}: ${steps[i]}...`])

      timerRef.current = setTimeout(() => {
        setStepStatuses(() => steps.map((_, idx) => (idx <= i ? "done" : "pending")))
        setExecutionLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Paso ${i + 1} completado.`])
        i++
        runStep()
      }, 800 + Math.random() * 700)
    }
    runStep()
  }, [selectedWorkflow])

  const stopRun = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setRunState("idle")
    setCurrentStep(-1)
    setStepStatuses([])
    setExecutionLog([])
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Automatizacion de Workflows</h2>
            <p className="text-sm text-muted-foreground">
              Flujos automatizados que conectan SAGE X3, Python y herramientas ofimaticas
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalExecutions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Ejecuciones totales</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10">
              <CheckCircle2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{avgSuccess}%</p>
              <p className="text-xs text-muted-foreground">Tasa de exito promedio</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-chart-3/10">
              <Activity className="w-4 h-4 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{activeCount}/{n8nWorkflows.length}</p>
              <p className="text-xs text-muted-foreground">Workflows activos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Workflow List */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
            Workflows Configurados
          </h3>
          {n8nWorkflows.map((wf) => (
            <button
              key={wf.id}
              type="button"
              onClick={() => {
                stopRun()
                setSelectedWorkflow(wf)
              }}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                selectedWorkflow.id === wf.id
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border hover:border-primary/20"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-card-foreground">{wf.name}</span>
                {wf.status === "activo" ? (
                  <Play className="w-3.5 h-3.5 text-accent" />
                ) : (
                  <Pause className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{wf.trigger}</span>
                <span>{wf.executions.toLocaleString()} ejecuciones</span>
              </div>
            </button>
          ))}
        </div>

        {/* Workflow Detail */}
        <Card className="lg:col-span-3 bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-card-foreground">
                  {selectedWorkflow.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {selectedWorkflow.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    selectedWorkflow.status === "activo"
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {selectedWorkflow.status === "activo" ? "Activo" : "Pausado"}
                </Badge>
                {runState === "running" ? (
                  <button
                    type="button"
                    onClick={stopRun}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    <Square className="w-3 h-3" />
                    Detener
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={simulateRun}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      runState === "done"
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Play className="w-3 h-3" />
                    {runState === "done" ? "Ejecutar de nuevo" : "Ejecutar"}
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Workflow info */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Trigger:</span>
                <span className="text-card-foreground font-medium">{selectedWorkflow.trigger}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Exito:</span>
                <span className="text-card-foreground font-medium">{selectedWorkflow.successRate}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ejecuciones:</span>
                <span className="text-card-foreground font-medium">{selectedWorkflow.executions.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ultima:</span>
                <span className="text-card-foreground font-medium font-mono text-xs">{selectedWorkflow.lastRun}</span>
              </div>
            </div>

            {/* Workflow Steps Visual */}
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Pasos del Workflow
            </h4>
            <div className="flex flex-col gap-0 mb-5">
              {selectedWorkflow.steps.map((step, i) => {
                const status = stepStatuses[i]
                return (
                  <div key={step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all duration-300",
                        status === "done"
                          ? "bg-accent text-accent-foreground"
                          : status === "running"
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : status === "error"
                          ? "bg-destructive text-destructive-foreground"
                          : runState !== "idle"
                          ? "bg-muted text-muted-foreground"
                          : i === 0
                          ? "bg-primary text-primary-foreground"
                          : i === selectedWorkflow.steps.length - 1
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {status === "done" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : status === "running" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      {i < selectedWorkflow.steps.length - 1 && (
                        <div className={cn(
                          "w-px h-6 transition-colors duration-300",
                          status === "done" ? "bg-accent" : "bg-border"
                        )} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={cn(
                        "text-sm transition-colors duration-300",
                        status === "running" ? "text-primary font-medium" : status === "done" ? "text-accent" : "text-card-foreground"
                      )}>{step}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Execution Log */}
            {executionLog.length > 0 && (
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="flex items-center justify-between px-4 py-2 bg-sidebar border-b border-sidebar-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-chart-3/80" />
                    <div className="w-3 h-3 rounded-full bg-accent/80" />
                    <span className="text-xs text-sidebar-foreground ml-2 font-mono">
                      Execution Log
                    </span>
                  </div>
                  {runState === "running" && (
                    <div className="flex items-center gap-1.5">
                      <CircleDot className="w-3 h-3 text-accent animate-pulse" />
                      <span className="text-xs text-accent font-mono">running</span>
                    </div>
                  )}
                  {runState === "done" && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-accent" />
                      <span className="text-xs text-accent font-mono">success</span>
                    </div>
                  )}
                </div>
                <pre className="bg-sidebar text-sidebar-foreground p-4 overflow-x-auto text-xs leading-relaxed font-mono max-h-48 overflow-y-auto">
                  {executionLog.map((line, idx) => (
                    <div key={idx} className={cn(
                      idx === executionLog.length - 1 && runState === "running" ? "text-primary" : "text-sidebar-foreground"
                    )}>{line}</div>
                  ))}
                  {runState === "running" && <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5" />}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
