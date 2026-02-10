import { NextRequest, NextResponse } from "next/server"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import path from "node:path"

const execAsync = promisify(exec)

const VALID_SCRIPTS = ["revenue_forecast", "guest_sentiment", "inventory_optimizer"]

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json()

    if (!VALID_SCRIPTS.includes(script)) {
      return NextResponse.json({ error: "Script no valido" }, { status: 400 })
    }

    const scriptPath = path.join(process.cwd(), "scripts", "hotel_analytics.py")

    const { stdout, stderr } = await execAsync(
      `python3 "${scriptPath}" ${script}`,
      { timeout: 15000, maxBuffer: 1024 * 1024 }
    )

    // Separate terminal output from JSON data
    const parts = stdout.split("__JSON_OUTPUT__")
    const terminalOutput = parts[0].trim()
    let jsonData = null

    if (parts.length > 1) {
      try {
        jsonData = JSON.parse(parts[1].trim())
      } catch {
        // JSON parsing failed, continue without it
      }
    }

    return NextResponse.json({
      success: true,
      output: terminalOutput,
      data: jsonData,
      stderr: stderr || null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json(
      { success: false, error: message, output: `Error ejecutando script: ${message}` },
      { status: 500 }
    )
  }
}
