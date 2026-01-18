"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/dashboard/header"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TDRWaveform } from "@/components/dashboard/tdr-waveform"
import { CableVisualizer } from "@/components/dashboard/cable-visualizer"
import { DeviceStatus } from "@/components/dashboard/device-status"
import { AIAnalysis } from "@/components/dashboard/ai-analysis"
import { TestHistory } from "@/components/dashboard/test-history"

// Import your new page components
import History from "@/components/pages/History"
import CableLibrary from "@/components/pages/CableLibrary"
import Reports from "@/components/pages/Reports"
import Settings from "@/components/pages/Settings"

// Types
interface TestData {
  cableType: string
  length: number
  faultDistance: number | null
  testStatus: "pass" | "fail" | "warning"
  impedance: string
  expectedImpedance: string
  quality: number
}

interface TestHistoryItem {
  id: number
  time: string
  cableType: string
  length: string
  result: "pass" | "fail" | "warning"
  faultAt: string | null
  quality: number
}

// Helper function to generate random test results
function generateTestResults(cableType: string, length: number): TestData {
  const hasFault = Math.random() > 0.4 // 60% chance of fault
  const faultDistance = hasFault ? Math.random() * length * 0.8 : null
  const quality = hasFault ? Math.floor(60 + Math.random() * 20) : Math.floor(85 + Math.random() * 15)
  
  let testStatus: "pass" | "fail" | "warning"
  if (quality >= 90) testStatus = "pass"
  else if (quality >= 75) testStatus = "warning"
  else testStatus = "fail"

  const expectedImpedance = cableType.includes("Fiber") ? "50Ω" : "100Ω"
  const impedance = hasFault ? "∞ Ω" : expectedImpedance

  return {
    cableType,
    length,
    faultDistance,
    testStatus,
    impedance,
    expectedImpedance,
    quality,
  }
}

// Helper function to format time
function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export default function DashboardPage() {
  const [activeId, setActiveId] = useState("dashboard")
  
  // Initial test data
  const [currentTest, setCurrentTest] = useState<TestData>({
    cableType: "Cat6 UTP",
    length: 100,
    faultDistance: 47.3,
    testStatus: "fail",
    impedance: "∞ Ω",
    expectedImpedance: "100Ω",
    quality: 73,
  })

  // Initial test history
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>([
    {
      id: 2,
      time: "2 hours ago",
      cableType: "Fiber SM",
      length: "500m",
      result: "pass",
      faultAt: null,
      quality: 98,
    },
    {
      id: 3,
      time: "Yesterday",
      cableType: "Cat5e UTP",
      length: "50m",
      result: "warning",
      faultAt: null,
      quality: 82,
    },
    {
      id: 4,
      time: "2 days ago",
      cableType: "Cat6a STP",
      length: "75m",
      result: "pass",
      faultAt: null,
      quality: 95,
    },
  ])

  // Handle new test
  const handleNewTest = useCallback((cableType: string, length: number) => {
    // Save current test to history if it exists
    if (currentTest.cableType) {
      const historyItem: TestHistoryItem = {
        id: Date.now(),
        time: "Just now",
        cableType: currentTest.cableType,
        length: `${currentTest.length}m`,
        result: currentTest.testStatus,
        faultAt: currentTest.faultDistance ? `${currentTest.faultDistance.toFixed(1)}m` : null,
        quality: currentTest.quality,
      }
      setTestHistory((prev) => [historyItem, ...prev])
    }

    // Generate new test results
    const newTest = generateTestResults(cableType, length)
    setCurrentTest(newTest)
  }, [currentTest])

  // Function to determine what to show in the main area
  const renderMainContent = () => {
    switch (activeId) {
      case "dashboard":
        return (
          <>
            <StatsCards testData={currentTest} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <TDRWaveform 
                  faultDistance={currentTest.faultDistance} 
                  cableLength={currentTest.length}
                  testStatus={currentTest.testStatus}
                />
                <CableVisualizer 
                  faultDistance={currentTest.faultDistance} 
                  cableLength={currentTest.length}
                  cableType={currentTest.cableType}
                />
              </div>
              <div className="space-y-6">
                <DeviceStatus />
                <AIAnalysis testData={currentTest} />
              </div>
            </div>
            <TestHistory history={testHistory} />
          </>
        )
      case "history":
        return <History />
      case "cables":
        return <CableLibrary />
      case "reports":
        return <Reports />
      case "settings":
        return <Settings />
      default:
        return <StatsCards testData={currentTest} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header onNewTest={handleNewTest} />

        <div className="flex">
          {/* 1. Pass the state down to your Sidebar */}
          <SidebarNav activeId={activeId} setActiveId={setActiveId} />

          <main className="flex-1 p-4 lg:p-6 space-y-6 max-w-full overflow-x-hidden">
            {/* Page title - Dynamic based on activeId */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  {activeId.replace('-', ' ')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeId === 'dashboard' ? 'Real-time TDR analysis and fault detection' : `Manage your ${activeId} settings and data`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Last updated: Just now
              </div>
            </div>

            {/* 2. Render the switched content */}
            {renderMainContent()}
          </main>
        </div>
      </div>
    </div>
  )
}