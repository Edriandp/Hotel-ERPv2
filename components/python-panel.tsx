"use client"

import { useRef, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { pythonScripts } from "@/lib/hotel-data"
import { cn } from "@/lib/utils"
import {
  Code2,
  Play,
  CheckCircle2,
  Terminal,
  Cpu,
  BarChart3,
  Brain,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useState } from "react"

const SCRIPT_API_MAP: Record<string, string> = {
  "revenue_forecast.py": "revenue_forecast",
  "guest_sentiment.py": "guest_sentiment",
  "inventory_optimizer.py": "inventory_optimizer",
}

export function PythonPanel() {
  const [selectedScript, setSelectedScript] = useState(pythonScripts[0])
  const [showOutput, setShowOutput] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const executeScript = useCallback(async () => {
    setShowOutput(true)
    setIsRunning(true)
    setVisibleLines([])
    setError(null)

    try {
      const scriptKey = SCRIPT_API_MAP[selectedScript.name]
      const res = await fetch("/api/python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptKey }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || "Error ejecutando el script")
        setIsRunning(false)
        return
      }

      // Stream the output line by line for effect
      const lines = data.output.split("\n")
      let i = 0
      const addLine = () => {
        if (i >= lines.length) {
          setIsRunning(false)
          return
        }
        setVisibleLines((prev) => [...prev, lines[i]])
        i++
        timerRef.current = setTimeout(addLine, 40 + Math.random() * 60)
      }
      addLine()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error de conexion con el servidor"
      )
      setIsRunning(false)
    }
  }, [selectedScript])

  const resetOutput = useCallback(() => {
    setShowOutput(false)
    setIsRunning(false)
    setVisibleLines([])
    setError(null)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Python - Analytics & Machine Learning
            </h2>
            <p className="text-sm text-muted-foreground">
              Scripts reales ejecutados en el servidor, conectados a datos de
              SAGE X3
            </p>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Data Analytics
              </p>
              <p className="text-xs text-muted-foreground">
                pandas, numpy, matplotlib
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10">
              <Brain className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Machine Learning
              </p>
              <p className="text-xs text-muted-foreground">
                scikit-learn, NLP, TextBlob
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-chart-3/10">
              <Cpu className="w-4 h-4 text-chart-3" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Optimizacion
              </p>
              <p className="text-xs text-muted-foreground">
                scipy, EOQ, scheduling
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {pythonScripts.map((script) => (
          <button
            key={script.name}
            type="button"
            onClick={() => {
              setSelectedScript(script)
              resetOutput()
            }}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all duration-200",
              selectedScript.name === script.name
                ? "bg-primary/5 border-primary/30"
                : "bg-card border-border hover:border-primary/20"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono font-medium text-card-foreground">
                {script.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {script.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {script.libraries.map((lib) => (
                <Badge
                  key={lib}
                  variant="outline"
                  className="text-xs bg-muted text-muted-foreground border-border"
                >
                  <Package className="w-3 h-3 mr-1" />
                  {lib}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              <span>
                {script.status} - {script.lastRun}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-card-foreground flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                {selectedScript.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {selectedScript.language} | {selectedScript.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {showOutput && (
                <button
                  type="button"
                  onClick={resetOutput}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Ver Codigo
                </button>
              )}
              <button
                type="button"
                disabled={isRunning}
                onClick={executeScript}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isRunning
                    ? "bg-chart-3 text-foreground cursor-wait"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Ejecutar
                  </>
                )}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Error de ejecucion</p>
                <p className="text-xs mt-1 opacity-80">{error}</p>
              </div>
            </div>
          )}

          <div className="rounded-lg overflow-hidden border border-border">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-sidebar border-b border-sidebar-border">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-chart-3/80" />
              <div className="w-3 h-3 rounded-full bg-accent/80" />
              <span className="text-xs text-sidebar-foreground ml-2 font-mono">
                {showOutput ? "python3 hotel_analytics.py" : selectedScript.name}
              </span>
              {isRunning && (
                <span className="ml-auto text-xs text-accent font-mono animate-pulse">
                  running...
                </span>
              )}
              {showOutput && !isRunning && visibleLines.length > 0 && !error && (
                <span className="ml-auto text-xs text-accent font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> done
                </span>
              )}
            </div>
            {/* Code / Output */}
            <pre className="bg-sidebar text-sidebar-foreground p-4 overflow-x-auto text-xs leading-relaxed font-mono max-h-96 overflow-y-auto">
              {showOutput ? (
                <code>
                  {visibleLines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                  {isRunning && (
                    <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5" />
                  )}
                </code>
              ) : (
                <code>{selectedScript.code}</code>
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
