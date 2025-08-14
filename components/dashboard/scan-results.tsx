"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, Download, Share, Eye, Clock, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface ScanResultsProps {
  results: {
    summary: {
      total: number
      critical: number
      high: number
      medium: number
      low: number
      riskScore: number
      scanDuration: number
      targetUrl: string
      timestamp: string
    }
    vulnerabilities: Array<{
      id: string | number
      title: string
      severity: string
      description: string
      location: string
      cvss: number
      timestamp: string
    }>
    recommendations: string[]
  }
}

export function ScanResults({ results }: ScanResultsProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-400"
    if (score >= 60) return "text-orange-400"
    if (score >= 40) return "text-yellow-400"
    return "text-primary-green"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "Critical Risk"
    if (score >= 60) return "High Risk"
    if (score >= 40) return "Medium Risk"
    return "Low Risk"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/20 bg-red-500/10 text-red-400"
      case "high":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400"
      case "medium":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
      case "low":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400"
      default:
        return "border-primary-green/20 bg-primary-green/10 text-primary-green"
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card className="glass-panel p-6 animate-in slide-in-from-bottom duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary-green" />
            <h3 className="text-lg font-semibold text-primary-green">Scan Results</h3>
          </div>
          <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 rounded-lg bg-background/30 border border-primary-green/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-foreground/60" />
              <span className="text-foreground/60">Target:</span>
            </div>
            <span className="font-mono text-primary-green">{results.summary.targetUrl}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-foreground/60" />
              <span className="text-foreground/60">Duration:</span>
            </div>
            <span className="font-mono">{formatDuration(results.summary.scanDuration)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-foreground/60" />
              <span className="text-foreground/60">Findings:</span>
            </div>
            <span className="font-mono">{results.summary.total} vulnerabilities</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Risk Assessment</span>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRiskColor(results.summary.riskScore)}`}>
                {results.summary.riskScore}/100
              </div>
              <div className={`text-xs ${getRiskColor(results.summary.riskScore)}`}>
                {getRiskLevel(results.summary.riskScore)}
              </div>
            </div>
          </div>
          <Progress value={results.summary.riskScore} className="h-3">
            <div
              className={`h-full transition-all duration-300 ease-out rounded-full ${
                results.summary.riskScore >= 80
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : results.summary.riskScore >= 60
                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                    : results.summary.riskScore >= 40
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-primary-green to-lime-green"
              }`}
              style={{ width: `${results.summary.riskScore}%` }}
            />
          </Progress>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-lg font-bold text-red-400">{results.summary.critical}</div>
            <div className="text-xs text-foreground/60">Critical</div>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-lg font-bold text-orange-400">{results.summary.high}</div>
            <div className="text-xs text-foreground/60">High</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-lg font-bold text-yellow-400">{results.summary.medium}</div>
            <div className="text-xs text-foreground/60">Medium</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-lg font-bold text-blue-400">{results.summary.low}</div>
            <div className="text-xs text-foreground/60">Low</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground/80">Discovered Vulnerabilities</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {results.vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="p-3 rounded-lg bg-background/50 border border-primary-green/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">{vuln.title}</h5>
                  <Badge variant="outline" className={`text-xs ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/60">{vuln.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground/40">{vuln.location}</span>
                  <span className="font-mono">CVSS: {vuln.cvss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {results.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground/80">Security Recommendations</h4>
            <div className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="p-3 rounded-lg bg-primary-green/5 border border-primary-green/20">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{rec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button className="cyber-button w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Detailed Report
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-primary-green/20 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="border-primary-green/20 bg-transparent">
              <Share className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
