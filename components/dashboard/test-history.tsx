"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TestHistoryItem {
  id: number
  time: string
  cableType: string
  length: string
  result: "pass" | "fail" | "warning"
  faultAt: string | null
  quality: number
}

interface TestHistoryProps {
  history: TestHistoryItem[]
}

export function TestHistory({ history }: TestHistoryProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Tests
        </CardTitle>
        <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground">
          {history.length} tests
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No test history yet</p>
            <p className="text-xs mt-1">Run a test to see results here</p>
          </div>
        ) : (
          history.map((test) => (
          <div
            key={test.id}
            className={`p-3 rounded-lg border transition-all duration-200 hover:bg-secondary/30 ${
              test.result === "fail"
                ? "bg-destructive/5 border-destructive/20"
                : test.result === "warning"
                  ? "bg-chart-5/5 border-chart-5/20"
                  : "bg-secondary/20 border-border/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    test.result === "fail"
                      ? "bg-destructive"
                      : test.result === "warning"
                        ? "bg-chart-5"
                        : "bg-accent"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{test.cableType}</span>
                    <span className="text-xs text-muted-foreground">• {test.length}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{test.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {test.faultAt && (
                  <span className="text-xs font-mono text-destructive">
                    Fault @ {test.faultAt}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className={
                    test.result === "fail"
                      ? "border-destructive/50 text-destructive bg-destructive/10"
                      : test.result === "warning"
                        ? "border-chart-5/50 text-chart-5 bg-chart-5/10"
                        : "border-accent/50 text-accent bg-accent/10"
                  }
                >
                  {test.quality}%
                </Badge>
              </div>
            </div>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
