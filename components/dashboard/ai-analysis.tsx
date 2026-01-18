"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TestData {
  cableType: string
  length: number
  faultDistance: number | null
  testStatus: "pass" | "fail" | "warning"
  impedance: string
  expectedImpedance: string
  quality: number
}

interface AIAnalysisProps {
  testData: TestData
}

// Deterministic pseudo-random function based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function AIAnalysis({ testData }: AIAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(100)

  // Calculate metrics based on test data using deterministic values
  // Use testData properties as seed to ensure consistency between server and client
  const signalIntegrity = testData.faultDistance ? Math.max(50, testData.quality - 10) : testData.quality
  
  // Create a seed from testData properties for deterministic random values
  const seed = useMemo(() => {
    return (testData.quality * 1000 + (testData.length || 0) + (testData.faultDistance || 0) * 100) % 10000
  }, [testData.quality, testData.length, testData.faultDistance])
  
  const estimatedSpeed = useMemo(() => {
    if (testData.testStatus === "pass") {
      return 900 + seededRandom(seed) * 100
    }
    return testData.quality * 10
  }, [testData.testStatus, testData.quality, seed])
  
  const latency = useMemo(() => {
    if (testData.testStatus === "pass") {
      return 1.5 + seededRandom(seed + 1) * 1
    }
    return 2 + seededRandom(seed + 2) * 2
  }, [testData.testStatus, seed])

  const metrics = useMemo(() => [
    { label: "Cable Quality", value: testData.quality, displayValue: testData.quality.toString(), status: testData.testStatus === "pass" ? "good" : testData.testStatus === "warning" ? "warning" : "bad", unit: "%" },
    { label: "Signal Integrity", value: Math.round(signalIntegrity), displayValue: Math.round(signalIntegrity).toString(), status: signalIntegrity >= 80 ? "good" : signalIntegrity >= 60 ? "warning" : "bad", unit: "%" },
    { label: "Estimated Speed", value: Math.round(estimatedSpeed), displayValue: Math.round(estimatedSpeed).toString(), status: estimatedSpeed >= 800 ? "good" : estimatedSpeed >= 600 ? "warning" : "bad", unit: "Mbps" },
    { label: "Latency", value: latency, displayValue: latency.toFixed(1), status: latency <= 2 ? "good" : latency <= 3 ? "warning" : "bad", unit: "ms" },
  ], [testData.quality, testData.testStatus, signalIntegrity, estimatedSpeed, latency])

  const runAnalysis = () => {
    setAnalyzing(true)
    setProgress(0)
  }

  useEffect(() => {
    if (analyzing && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setAnalyzing(false)
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [analyzing, progress])

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          AI-Powered Analysis
        </CardTitle>
        <Badge className="bg-primary/20 text-primary border-primary/30">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.5 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
          Neural Engine
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis progress */}
        {analyzing && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary">Analyzing cable patterns...</span>
              <span className="text-sm font-mono text-primary">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-3 rounded-lg bg-secondary/30 border border-border/50"
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={`text-2xl font-mono font-bold ${
                    metric.status === "good"
                      ? "text-accent"
                      : metric.status === "warning"
                        ? "text-chart-5"
                        : "text-destructive"
                  }`}
                >
                  {metric.displayValue}
                </span>
                <span className="text-xs text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric.status === "good"
                      ? "bg-accent"
                      : metric.status === "warning"
                        ? "bg-chart-5"
                        : "bg-destructive"
                  }`}
                  style={{
                    width: `${
                      metric.unit === "%"
                        ? metric.value
                        : metric.unit === "Mbps"
                          ? (metric.value / 1000) * 100
                          : metric.unit === "ms"
                            ? 100 - metric.value * 10
                            : 50
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            AI Recommendation
          </h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {testData.testStatus === "pass" ? (
              <>
                Based on TDR reflection analysis and signal pattern recognition, the cable shows
                <span className="text-accent font-semibold"> excellent integrity</span> with no faults detected.
                The cable is operating within optimal parameters. Estimated repair priority: <span className="text-accent font-semibold">None</span>.
              </>
            ) : testData.testStatus === "warning" ? (
              <>
                Based on TDR reflection analysis and signal pattern recognition, the cable shows
                <span className="text-chart-5 font-semibold"> minor degradation</span>.
                {testData.faultDistance && ` Fault detected at ${testData.faultDistance.toFixed(1)}m.`}
                Consider monitoring or preventive maintenance. Estimated repair priority: <span className="text-chart-5 font-semibold">Medium</span>.
              </>
            ) : (
              <>
                Based on TDR reflection analysis and signal pattern recognition, the cable shows
                <span className="text-destructive font-semibold"> significant degradation</span>.
                {testData.faultDistance && ` Fault detected at ${testData.faultDistance.toFixed(1)}m.`}
                Consider replacing the entire cable run for optimal performance. Estimated repair priority: <span className="text-destructive font-semibold">High</span>.
              </>
            )}
          </p>
        </div>

        <Button
          onClick={runAnalysis}
          disabled={analyzing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {analyzing ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                <path
                  d="M4 12a8 8 0 018-8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Running Analysis...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4a8 8 0 00-8 8 8 8 0 008 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18a6 6 0 110-12c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Re-run AI Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
