"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TDRWaveformProps {
  faultDistance: number | null
  cableLength: number
  testStatus: "pass" | "fail" | "warning"
}

export function TDRWaveform({ faultDistance, cableLength, testStatus }: TDRWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  const faultLocation = faultDistance || 0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    const animate = () => {
      ctx.fillStyle = "#0a0f1a"
      ctx.fillRect(0, 0, width, height)

      // Grid lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }

      for (let i = 0; i < height; i += 30) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // TDR Waveform
      ctx.beginPath()
      ctx.strokeStyle = "#38bdf8"
      ctx.lineWidth = 2
      ctx.shadowColor = "#38bdf8"
      ctx.shadowBlur = 10

      const faultX = faultLocation > 0 ? (faultLocation / cableLength) * width : width
      const pulsePosition = (animationPhase % 100) / 100 * width

      for (let x = 0; x < width; x++) {
        const baseY = height / 2
        let y = baseY

        // Pulse traveling animation
        if (x < pulsePosition && pulsePosition < faultX) {
          const pulseWidth = 30
          const distFromPulse = Math.abs(x - pulsePosition)
          if (distFromPulse < pulseWidth) {
            const pulseIntensity = 1 - distFromPulse / pulseWidth
            y = baseY - Math.sin(pulseIntensity * Math.PI) * 40
          }
        }

        // Reflection from fault
        if (pulsePosition >= faultX && x > faultX) {
          const reflectedPulsePos = faultX + (pulsePosition - faultX)
          const pulseWidth = 30
          const distFromPulse = Math.abs(x - reflectedPulsePos)
          if (distFromPulse < pulseWidth && x < reflectedPulsePos) {
            const pulseIntensity = 1 - distFromPulse / pulseWidth
            y = baseY + Math.sin(pulseIntensity * Math.PI) * 30
          }
        }

        // Fault spike
        if (Math.abs(x - faultX) < 15) {
          const intensity = 1 - Math.abs(x - faultX) / 15
          y = baseY + intensity * 60 * Math.sin((x - faultX) * 0.5)
        }

        // Deterministic noise based on x position and animation phase
        // This ensures consistent rendering between server and client
        const noiseSeed = (x * 0.1 + animationPhase * 0.05) % 1000
        const noise = (Math.sin(noiseSeed) * 10000) % 1
        y += (noise - 0.5) * 3

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      ctx.shadowBlur = 0

      // Fault marker (only if fault exists)
      if (faultLocation > 0) {
        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.arc(faultX, height / 2, 6, 0, Math.PI * 2)
        ctx.fill()

        // Fault label
        ctx.fillStyle = "#ef4444"
        ctx.font = "12px Geist Mono, monospace"
        ctx.textAlign = "center"
        ctx.fillText(`FAULT @ ${faultLocation.toFixed(1)}m`, faultX, height / 2 - 20)
      }

      setAnimationPhase((prev) => (prev + 1) % 200)
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [animationPhase, faultLocation, cableLength])

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          TDR Waveform Analysis
        </CardTitle>
        <Badge 
          variant="outline" 
          className={
            testStatus === "fail" 
              ? "border-destructive text-destructive animate-pulse"
              : testStatus === "warning"
              ? "border-chart-5 text-chart-5"
              : "border-accent text-accent"
          }
        >
          {testStatus === "fail" ? "Fault Detected" : testStatus === "warning" ? "Warning" : "No Faults"}
        </Badge>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="w-full h-[180px] rounded-lg"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>0m</span>
          <span>{(cableLength * 0.25).toFixed(0)}m</span>
          <span>{(cableLength * 0.5).toFixed(0)}m</span>
          <span>{(cableLength * 0.75).toFixed(0)}m</span>
          <span>{cableLength}m</span>
        </div>
      </CardContent>
    </Card>
  )
}
