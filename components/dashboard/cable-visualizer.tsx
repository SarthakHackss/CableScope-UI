"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CableVisualizerProps {
  faultDistance: number | null
  cableLength: number
  cableType: string
}

export function CableVisualizer({ faultDistance, cableLength, cableType }: CableVisualizerProps) {
  const [pulsePosition, setPulsePosition] = useState(0)
  const faultLocation = faultDistance ? (faultDistance / cableLength) * 100 : 0

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePosition((prev) => {
        if (prev >= faultLocation * 2) return 0
        return prev + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [faultLocation])

  const segments = Array.from({ length: 20 }, (_, i) => {
    const segmentPosition = (i / 20) * 100
    const isFault = Math.abs(segmentPosition - faultLocation) < 5
    const isPulseHere = Math.abs(segmentPosition - pulsePosition) < 8
    const isPulseReturning =
      pulsePosition > faultLocation &&
      Math.abs(segmentPosition - (faultLocation * 2 - pulsePosition)) < 8

    return { isFault, isPulseHere, isPulseReturning, position: segmentPosition }
  })

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Cable Path Visualization
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {cableType}
          </Badge>
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            {cableLength}m
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cable visualization */}
        <div className="relative">
          {/* Cable path */}
          <div className="relative h-16 flex items-center">
            {/* Start connector */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">Start</span>
            </div>

            {/* Cable segments */}
            <div className="flex-1 mx-2 relative">
              <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                <div className="h-3 w-full rounded-full bg-secondary/50 overflow-hidden flex">
                  {segments.map((seg, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-full transition-all duration-100 ${
                        seg.isFault
                          ? "bg-destructive animate-pulse"
                          : seg.isPulseHere || seg.isPulseReturning
                            ? "bg-primary shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                            : "bg-secondary/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Fault marker */}
              {faultDistance && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 z-20"
                  style={{ left: `${faultLocation}%` }}
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-destructive/20 border-2 border-destructive animate-ping absolute -inset-1" />
                    <div className="w-4 h-4 rounded-full bg-destructive relative z-10" />
                  </div>
                </div>
              )}
            </div>

            {/* End connector */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-muted border-2 border-muted-foreground/30 flex items-center justify-center opacity-50">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">End</span>
            </div>
          </div>

          {/* Distance markers */}
          <div className="flex justify-between mt-4 text-xs text-muted-foreground px-10">
            <span>0m</span>
            <span>{(cableLength * 0.25).toFixed(0)}m</span>
            {faultDistance ? (
              <span className="text-destructive font-semibold">
                {faultDistance.toFixed(1)}m ⚠️
              </span>
            ) : (
              <span>{(cableLength * 0.5).toFixed(0)}m</span>
            )}
            <span>{(cableLength * 0.75).toFixed(0)}m</span>
            <span>{cableLength}m</span>
          </div>
        </div>

        {/* Fault details */}
        {faultDistance ? (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-destructive">Cable Break Detected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Open circuit fault detected at <span className="text-foreground font-mono">{faultDistance.toFixed(1)} meters</span> from the source.
                  Impedance mismatch indicates complete cable severance.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-accent">No Faults Detected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Cable integrity check passed. No faults or impedance issues detected along the entire cable length.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
