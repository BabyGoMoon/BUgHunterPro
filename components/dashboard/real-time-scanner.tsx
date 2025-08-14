"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Zap, Clock, Target, CheckCircle } from "lucide-react"

interface ScanFinding {
  id: string
  type: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  impact: string
  recommendation: string
  cvss: number
  cwe?: string
  location?: string
}

interface ScanResult {
  targetUrl: string
  status: "scanning" | "completed" | "failed"
  progress: number
  findings: ScanFinding[]
  scannedAt: string
  duration: number
  totalChecks: number
  vulnerabilitiesFound: number
}

interface AIExplanation {
  summary: string
  technicalDetails: string
  businessImpact: string
  remediation: string
  priority: string
}

export default function RealTimeScanner() {
  const [targetUrl, setTargetUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-critical text-white"
      case "high":
        return "bg-high text-white"
      case "medium":
        return "bg-medium text-black"
      case "low":
        return "bg-low text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "high":
        return <Zap className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "low":
        return <Shield className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const startScan = async () => {
    if (!targetUrl.trim()) return

    setIsScanning(true)
    setScanResult(null)
    setAiExplanation(null)

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUrl }),
      })

      if (!response.ok) {
        throw new Error("Scan failed")
      }

      const result: ScanResult = await response.json()
      setScanResult(result)

      // Add to scan history
      setScanHistory((prev) => [result, ...prev.slice(0, 9)])

      // Get AI explanation if vulnerabilities found
      if (result.findings.length > 0) {
        const aiResponse = await fetch("/api/ai-explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ findings: result.findings }),
        })

        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          setAiExplanation(aiData.explanation)
        }
      }
    } catch (error) {
      console.error("Scan error:", error)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Scan Input */}
      <Card className="border-primary-green/20 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lime-green flex items-center gap-2">
            <Target className="w-5 h-5" />
            Real-Time Security Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter target URL (e.g., https://example.com)"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-black/60 border-primary-green/30 text-white"
              disabled={isScanning}
            />
            <Button
              onClick={startScan}
              disabled={isScanning || !targetUrl.trim()}
              className="cyber-button min-w-[120px]"
            >
              {isScanning ? "Scanning..." : "Start Scan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Progress */}
      {isScanning && (
        <Card className="border-primary-green/20 bg-black/40 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lime-green">Scanning in progress...</span>
                <span className="text-white">100%</span>
              </div>
              <Progress value={100} className="h-2" />
              <div className="text-sm text-gray-400">Performing comprehensive security analysis...</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-6">
          {/* Results Summary */}
          <Card className="border-primary-green/20 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lime-green flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Scan Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{scanResult.vulnerabilitiesFound}</div>
                  <div className="text-sm text-gray-400">Vulnerabilities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{scanResult.totalChecks}</div>
                  <div className="text-sm text-gray-400">Checks Performed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{scanResult.duration}ms</div>
                  <div className="text-sm text-gray-400">Scan Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lime-green">
                    {scanResult.status === "completed" ? "100%" : "0%"}
                  </div>
                  <div className="text-sm text-gray-400">Completion</div>
                </div>
              </div>

              {/* Findings */}
              {scanResult.findings.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-3">Security Findings</h3>
                  {scanResult.findings.map((finding) => (
                    <div key={finding.id} className="border border-primary-green/20 rounded-lg p-4 bg-black/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(finding.severity)}
                          <span className="font-semibold text-white">{finding.type}</span>
                        </div>
                        <Badge className={getSeverityColor(finding.severity)}>{finding.severity.toUpperCase()}</Badge>
                      </div>
                      <p className="text-gray-300 mb-2">{finding.description}</p>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>
                          <strong>Impact:</strong> {finding.impact}
                        </div>
                        <div>
                          <strong>Recommendation:</strong> {finding.recommendation}
                        </div>
                        <div className="flex gap-4">
                          <span>
                            <strong>CVSS:</strong> {finding.cvss}
                          </span>
                          {finding.cwe && (
                            <span>
                              <strong>CWE:</strong> {finding.cwe}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-lime-green mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Vulnerabilities Found</h3>
                  <p className="text-gray-400">Great job! Your target appears to be secure.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Explanation */}
          {aiExplanation && (
            <Card className="border-primary-green/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lime-green">🤖 AI Security Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Summary</h4>
                  <p className="text-gray-300">{aiExplanation.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Business Impact</h4>
                  <p className="text-gray-300">{aiExplanation.businessImpact}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Recommended Actions</h4>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm bg-black/40 p-3 rounded">
                    {aiExplanation.remediation}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card className="border-primary-green/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lime-green">Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.slice(0, 5).map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-primary-green/10 rounded bg-black/20"
                >
                  <div>
                    <div className="text-white font-medium">{scan.targetUrl}</div>
                    <div className="text-sm text-gray-400">{new Date(scan.scannedAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{scan.vulnerabilitiesFound} issues</div>
                    <div className="text-sm text-gray-400">{scan.duration}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
