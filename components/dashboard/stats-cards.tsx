"use client"

import React from "react"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  accentColor?: "primary" | "accent" | "destructive" | "chart-5"
}

interface TestData {
  cableType: string
  length: number
  faultDistance: number | null
  testStatus: "pass" | "fail" | "warning"
  impedance: string
  expectedImpedance: string
  quality: number
}

interface StatsCardsProps {
  testData: TestData
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  accentColor = "primary",
}: StatCardProps) {
  const colorClasses = {
    primary: "text-primary bg-primary/10 border-primary/30",
    accent: "text-accent bg-accent/10 border-accent/30",
    destructive: "text-destructive bg-destructive/10 border-destructive/30",
    "chart-5": "text-chart-5 bg-chart-5/10 border-chart-5/30",
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold font-mono text-foreground mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg border ${colorClasses[accentColor]}`}>
            {icon}
          </div>
        </div>
        {trend && trendValue && (
          <div className="mt-3 flex items-center gap-1">
            {trend === "up" && (
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend === "down" && (
              <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span
              className={`text-xs ${
                trend === "up" ? "text-accent" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function StatsCards({ testData }: StatsCardsProps) {
  const getCableSubtitle = (cableType: string) => {
    if (cableType.includes("UTP")) return "Unshielded Twisted Pair"
    if (cableType.includes("STP")) return "Shielded Twisted Pair"
    if (cableType.includes("Fiber")) return "Optical Fiber"
    return "Network Cable"
  }

  const getStatusValue = (status: "pass" | "fail" | "warning") => {
    if (status === "pass") return "Passed"
    if (status === "fail") return "Failed"
    return "Warning"
  }

  const getStatusSubtitle = (status: "pass" | "fail" | "warning", faultDistance: number | null) => {
    if (status === "pass") return "No faults detected"
    if (status === "fail") return faultDistance ? "1 fault detected" : "Fault detected"
    return "Minor issues detected"
  }

  const faultValue = testData.faultDistance ? `${testData.faultDistance.toFixed(1)}m` : "None"
  const faultTrend = testData.faultDistance ? "down" : undefined
  const faultTrendValue = testData.faultDistance ? "Open circuit" : undefined

  const impedanceTrend = testData.impedance === testData.expectedImpedance ? undefined : "up"
  const impedanceTrendValue = testData.impedance === testData.expectedImpedance ? undefined : "Abnormal"

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Cable Type"
        value={testData.cableType}
        subtitle={getCableSubtitle(testData.cableType)}
        accentColor="primary"
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H4V7h16v10zM6 10h2v4H6zm3 0h2v4H9zm3 0h2v4h-2zm3 0h2v4h-2z" />
          </svg>
        }
      />
      <StatCard
        title="Fault Distance"
        value={faultValue}
        subtitle={testData.faultDistance ? "±0.1m accuracy" : "No faults"}
        accentColor={testData.faultDistance ? "destructive" : "accent"}
        trend={faultTrend}
        trendValue={faultTrendValue}
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        }
      />
      <StatCard
        title="Test Status"
        value={getStatusValue(testData.testStatus)}
        subtitle={getStatusSubtitle(testData.testStatus, testData.faultDistance)}
        accentColor={testData.testStatus === "fail" ? "destructive" : testData.testStatus === "warning" ? "chart-5" : "accent"}
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        }
      />
      <StatCard
        title="Impedance"
        value={testData.impedance}
        subtitle={`Expected: ${testData.expectedImpedance}`}
        accentColor="chart-5"
        trend={impedanceTrend}
        trendValue={impedanceTrendValue}
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.79 15.41c.01-.35.21-.67.56-.74.36-.09.68.14.79.49.03.1.04.2.04.31V18c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h9.5c.28 0 .5.22.5.5s-.22.5-.5.5H5v13h13v-2.59zM12 13l-4-4 1.41-1.41L12 10.17l4.59-4.58L18 7l-6 6z" />
          </svg>
        }
      />
    </div>
  )
}
