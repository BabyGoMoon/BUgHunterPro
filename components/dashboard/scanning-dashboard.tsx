"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScanProgress } from "@/components/dashboard/scan-progress"
import { TerminalLog } from "@/components/dashboard/terminal-log"
import { VulnerabilityGraph } from "@/components/dashboard/vulnerability-graph"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { ScanResults } from "@/components/dashboard/scan-results"
import { Play, Square, RotateCcw, Globe, Shield, Zap, AlertTriangle } from "lucide-react"

const SCAN_PHASES = [
  { name: "reconnaissance", label: "Reconnaissance", duration: 3000 },
  { name: "port_scan", label: "Port Scanning", duration: 4000 },
  { name: "service_detection", label: "Service Detection", duration: 3500 },
  { name: "vulnerability_scan", label: "Vulnerability Assessment", duration: 5000 },
  { name: "web_crawling", label: "Web Application Crawling", duration: 4500 },
  { name: "payload_testing", label: "Payload Testing", duration: 6000 },
  { name: "report_generation", label: "Report Generation", duration: 2000 },
]

export function ScanningDashboard() {
  const [targetUrl, setTargetUrl] = useState("https://example.com")
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<string | null>(null)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [scanResults, setScanResults] = useState<any>(null)
  const [realTimeFindings, setRealTimeFindings] = useState<any[]>([])

  useEffect(() => {
    if (isScanning && phaseIndex < SCAN_PHASES.length) {
      const currentPhaseData = SCAN_PHASES[phaseIndex]
      setCurrentPhase(currentPhaseData.name)

      const timer = setTimeout(() => {
        // Simulate finding vulnerabilities during scan
        if (currentPhaseData.name === "vulnerability_scan" || currentPhaseData.name === "payload_testing") {
          simulateVulnerabilityDiscovery()
        }

        if (phaseIndex === SCAN_PHASES.length - 1) {
          handleScanComplete()
        } else {
          setPhaseIndex((prev) => prev + 1)
        }
      }, currentPhaseData.duration)

      return () => clearTimeout(timer)
    }
  }, [isScanning, phaseIndex])

  const simulateVulnerabilityDiscovery = () => {
    const vulnerabilities = [
      {
        id: Date.now() + Math.random(),
        title: "SQL Injection Vulnerability",
        severity: "critical",
        location: "/login.php",
        description: "Potential SQL injection in login form parameter 'username'",
        cvss: 9.8,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + Math.random() + 1,
        title: "Cross-Site Scripting (XSS)",
        severity: "high",
        location: "/search",
        description: "Reflected XSS vulnerability in search parameter",
        cvss: 7.5,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + Math.random() + 2,
        title: "Insecure Direct Object Reference",
        severity: "high",
        location: "/user/profile",
        description: "User can access other users' profiles by changing ID parameter",
        cvss: 8.1,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + Math.random() + 3,
        title: "Missing Security Headers",
        severity: "medium",
        location: "Global",
        description: "Missing X-Frame-Options, CSP, and HSTS headers",
        cvss: 5.3,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + Math.random() + 4,
        title: "Weak Password Policy",
        severity: "medium",
        location: "/register",
        description: "Password policy allows weak passwords (minimum 6 characters)",
        cvss: 4.7,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + Math.random() + 5,
        title: "Information Disclosure",
        severity: "low",
        location: "/error",
        description: "Error pages reveal sensitive server information",
        cvss: 3.1,
        timestamp: new Date().toISOString(),
      },
    ]

    // Add 1-2 random vulnerabilities during this phase
    const numFindings = Math.floor(Math.random() * 2) + 1
    const selectedVulns = vulnerabilities.slice(0, numFindings)

    setRealTimeFindings((prev) => [...prev, ...selectedVulns])
  }

  const handleStartScan = () => {
    setIsScanning(true)
    setScanComplete(false)
    setCurrentPhase(null)
    setPhaseIndex(0)
    setScanResults(null)
    setRealTimeFindings([])
  }

  const handleStopScan = () => {
    setIsScanning(false)
    setCurrentPhase(null)
    setPhaseIndex(0)
  }

  const handleScanComplete = () => {
    setIsScanning(false)
    setScanComplete(true)
    setCurrentPhase(null)

    const critical = realTimeFindings.filter((f) => f.severity === "critical").length
    const high = realTimeFindings.filter((f) => f.severity === "high").length
    const medium = realTimeFindings.filter((f) => f.severity === "medium").length
    const low = realTimeFindings.filter((f) => f.severity === "low").length

    const riskScore = Math.min(100, critical * 25 + high * 15 + medium * 8 + low * 3)

    setScanResults({
      summary: {
        total: realTimeFindings.length,
        critical,
        high,
        medium,
        low,
        riskScore,
        scanDuration: SCAN_PHASES.reduce((acc, phase) => acc + phase.duration, 0) / 1000,
        targetUrl,
        timestamp: new Date().toISOString(),
      },
      vulnerabilities: realTimeFindings,
      recommendations: generateRecommendations(realTimeFindings),
    })
  }

  const generateRecommendations = (findings: any[]) => {
    const recommendations = []

    if (findings.some((f) => f.title.includes("SQL Injection"))) {
      recommendations.push("Implement parameterized queries and input validation")
    }
    if (findings.some((f) => f.title.includes("XSS"))) {
      recommendations.push("Sanitize user input and implement Content Security Policy")
    }
    if (findings.some((f) => f.title.includes("Security Headers"))) {
      recommendations.push("Configure security headers: X-Frame-Options, CSP, HSTS")
    }
    if (findings.some((f) => f.title.includes("Password Policy"))) {
      recommendations.push("Enforce strong password requirements (8+ chars, complexity)")
    }

    return recommendations
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
            <Shield className="h-6 w-6 text-primary-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Scanning Dashboard</h1>
            <p className="text-foreground/60">Real-time vulnerability assessment and analysis</p>
          </div>
        </div>

        {/* Scan Controls */}
        <Card className="glass-panel p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground/80">Target URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="Enter target URL to scan..."
                  className="pl-10 bg-background/50 border-primary-green/20 focus:border-primary-green/40"
                  disabled={isScanning}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={handleStartScan} className="cyber-button">
                  <Play className="h-4 w-4 mr-2" />
                  Start Scan
                </Button>
              ) : (
                <Button onClick={handleStopScan} variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Scan
                </Button>
              )}
              <Button variant="outline" className="border-primary-green/20 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {isScanning && currentPhase && (
            <div className="mt-4 p-4 rounded-lg bg-primary-green/5 border border-primary-green/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-green">
                  Current Phase: {SCAN_PHASES.find((p) => p.name === currentPhase)?.label}
                </span>
                <Badge variant="outline" className="border-primary-green/20 text-primary-green animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="text-xs text-foreground/60">
                Phase {phaseIndex + 1} of {SCAN_PHASES.length} • {realTimeFindings.length} vulnerabilities found
              </div>
            </div>
          )}
        </Card>
      </div>

      {realTimeFindings.length > 0 && isScanning && (
        <Card className="glass-panel p-4 mb-6 border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <span className="font-medium text-orange-400">
              {realTimeFindings.length} vulnerabilities detected during scan
            </span>
            <Badge variant="outline" className="border-orange-500/20 text-orange-400 animate-pulse">
              Live
            </Badge>
          </div>
        </Card>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Terminal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scan Progress */}
          <ScanProgress
            isScanning={isScanning}
            onComplete={handleScanComplete}
            currentScan={currentPhase}
            phases={SCAN_PHASES}
            currentPhaseIndex={phaseIndex}
          />

          {/* Vulnerability Graph */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-green">Live Vulnerability Map</h3>
              <Badge variant="outline" className="border-primary-green/20 text-primary-green">
                <Zap className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
            <VulnerabilityGraph isScanning={isScanning} findings={realTimeFindings} />
          </Card>

          {/* Terminal Log */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-green">Scan Log</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
                <span className="text-sm text-foreground/60">Live Feed</span>
              </div>
            </div>
            <TerminalLog
              isScanning={isScanning}
              targetUrl={targetUrl}
              currentPhase={currentPhase}
              findings={realTimeFindings}
            />
          </Card>
        </div>

        {/* Right Column - AI Assistant & Results */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <AIAssistant isScanning={isScanning} findings={realTimeFindings} />

          {/* Scan Results */}
          {scanComplete && scanResults && <ScanResults results={scanResults} />}
        </div>
      </div>
    </div>
  )
}
