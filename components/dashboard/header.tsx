"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HeaderProps {
  onNewTest?: (cableType: string, length: number) => void
}

export function Header({ onNewTest }: HeaderProps) {
  const { toast } = useToast()
  const [isNewTestDialogOpen, setIsNewTestDialogOpen] = useState(false)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testConfig, setTestConfig] = useState({
    cableType: "",
    length: "",
  })

  const handleNewTest = () => {
    setIsNewTestDialogOpen(true)
  }

  const handleStartTest = () => {
    if (!testConfig.cableType || !testConfig.length) {
      toast({
        title: "Configuration incomplete",
        description: "Please select cable type and enter cable length.",
        variant: "destructive",
      })
      return
    }

    const length = parseFloat(testConfig.length)
    if (isNaN(length) || length <= 0) {
      toast({
        title: "Invalid length",
        description: "Please enter a valid cable length.",
        variant: "destructive",
      })
      return
    }

    setIsTestRunning(true)
    setIsNewTestDialogOpen(false)

    // Simulate test running
    toast({
      title: "Test started",
      description: `Starting TDR test on ${testConfig.cableType} (${testConfig.length}m)...`,
    })

    // Simulate test completion after a delay
    setTimeout(() => {
      setIsTestRunning(false)
      
      // Call the callback to update dashboard
      if (onNewTest) {
        onNewTest(testConfig.cableType, length)
      }
      
      toast({
        title: "Test completed",
        description: `TDR analysis completed for ${testConfig.cableType} cable.`,
      })
      
      // Reset form
      setTestConfig({ cableType: "", length: "" })
    }, 3000)
  }

  const handleExport = () => {
    try {
      // Collect current test data
      const exportData = {
        timestamp: new Date().toISOString(),
        testData: {
          cableType: "Cat6 UTP",
          faultDistance: "47.3m",
          testStatus: "Failed",
          impedance: "∞ Ω",
          expectedImpedance: "100Ω",
        },
        testHistory: [
          {
            id: 1,
            time: "Just now",
            cableType: "Cat6 UTP",
            length: "100m",
            result: "fail",
            faultAt: "47.3m",
            quality: 73,
          },
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
        ],
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2)
      
      // Create a blob and download
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cablescope-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Show success toast
      toast({
        title: "Export successful",
        description: "Test data has been exported successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Export failed",
        description: "An error occurred while exporting data.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H4V7h16v10zM6 10h2v4H6zm3 0h2v4H9zm3 0h2v4h-2zm3 0h2v4h-2z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">CableScope</h1>
              <p className="text-xs text-muted-foreground">AI-Powered TDR Fault Detection System</p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              Live Monitoring
            </Badge>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border/50 hover:bg-secondary/50 bg-transparent cursor-pointer"
                onClick={handleExport}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                onClick={handleNewTest}
                disabled={isTestRunning}
              >
                {isTestRunning ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    New Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Test Dialog */}
      <Dialog open={isNewTestDialogOpen} onOpenChange={setIsNewTestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start New TDR Test</DialogTitle>
            <DialogDescription>
              Configure the test parameters for your cable analysis. The test will analyze the cable for faults and impedance issues.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cable-type">Cable Type</Label>
              <Select
                value={testConfig.cableType}
                onValueChange={(value) => setTestConfig({ ...testConfig, cableType: value })}
              >
                <SelectTrigger id="cable-type">
                  <SelectValue placeholder="Select cable type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cat5e UTP">Cat5e UTP</SelectItem>
                  <SelectItem value="Cat6 UTP">Cat6 UTP</SelectItem>
                  <SelectItem value="Cat6a STP">Cat6a STP</SelectItem>
                  <SelectItem value="Cat7 STP">Cat7 STP</SelectItem>
                  <SelectItem value="Fiber SM">Fiber SM (Single Mode)</SelectItem>
                  <SelectItem value="Fiber MM">Fiber MM (Multi Mode)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="length">Cable Length (meters)</Label>
              <Input
                id="length"
                type="number"
                placeholder="e.g., 100"
                value={testConfig.length}
                onChange={(e) => setTestConfig({ ...testConfig, length: e.target.value })}
                min="1"
                max="1000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewTestDialogOpen(false)
                setTestConfig({ cableType: "", length: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleStartTest} disabled={!testConfig.cableType || !testConfig.length}>
              Start Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
