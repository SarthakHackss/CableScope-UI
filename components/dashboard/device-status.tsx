"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DeviceStatus() {
  const [cpuTemp, setCpuTemp] = useState(42)
  const [pulseCount, setPulseCount] = useState(0)

  useEffect(() => {
    const tempInterval = setInterval(() => {
      setCpuTemp((prev) => prev + (Math.random() - 0.5) * 2)
    }, 2000)

    const pulseInterval = setInterval(() => {
      setPulseCount((prev) => prev + 1)
    }, 500)

    return () => {
      clearInterval(tempInterval)
      clearInterval(pulseInterval)
    }
  }, [])

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Raspberry Pi 5 Status
        </CardTitle>
        <Badge className="bg-accent/20 text-accent border-accent/30">
          <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
          Online
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device visual */}
        <div className="relative p-4 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-4">
            {/* Pi icon */}
            <div className="w-16 h-16 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center relative overflow-hidden">
              <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8h-3V4H7v4H4v12h16V8zM9 6h6v2H9V6zm9 12H6v-8h12v8z" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent animate-pulse" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Raspberry Pi 5</h3>
              <p className="text-xs text-muted-foreground">8GB RAM • Broadcom BCM2712</p>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs text-muted-foreground">GPIO Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Pulse Gen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground">CPU Temperature</p>
            <p className="text-2xl font-mono font-bold text-foreground">
              {cpuTemp.toFixed(1)}°C
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                style={{ width: `${(cpuTemp / 80) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground">Pulses Sent</p>
            <p className="text-2xl font-mono font-bold text-primary">
              {pulseCount.toLocaleString()}
            </p>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-200 ${
                    (pulseCount % 8) > i ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground">Sample Rate</p>
            <p className="text-2xl font-mono font-bold text-foreground">
              1.2<span className="text-sm text-muted-foreground ml-1">GS/s</span>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground">Resolution</p>
            <p className="text-2xl font-mono font-bold text-foreground">
              0.1<span className="text-sm text-muted-foreground ml-1">m</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
