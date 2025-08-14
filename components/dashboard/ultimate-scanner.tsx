"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Globe, Search, Zap, Clock, CheckCircle, XCircle } from "lucide-react"

interface ScanResult {
  dns?: any
  crawler?: any
  vulnerabilities?: any
}

export default function UltimateScanner() {
  const [target, setTarget] = useState("")
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("")
  const [results, setResults] = useState<ScanResult>({})
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [error, setError] = useState("")

  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return domainRegex.test(domain) && domain.length <= 253
  }

  const sanitizeTarget = (input: string): string => {
    let cleaned = input.replace(/^https?:\/\//, "")
    cleaned = cleaned.replace(/\/$/, "")
    cleaned = cleaned.split("/")[0].split("?")[0]
    return cleaned.toLowerCase()
  }

  const runComprehensiveScan = async () => {
    if (!target) return

    const sanitizedTarget = sanitizeTarget(target)

    if (!isValidDomain(sanitizedTarget)) {
      setError("Please enter a valid domain name (e.g., example.com)")
      return
    }

    setScanning(true)
    setProgress(0)
    setResults({})
    setError("")

    try {
      setCurrentPhase("DNS Analysis & Domain Intelligence")
      setProgress(10)

      const dnsResponse = await fetch("/api/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: sanitizedTarget }),
      })

      if (!dnsResponse.ok) {
        throw new Error(`DNS lookup failed: ${dnsResponse.statusText}`)
      }

      const dnsData = await dnsResponse.json()
      setResults((prev) => ({ ...prev, dns: dnsData }))
      setProgress(25)

      setCurrentPhase("Deep Web Crawling & Endpoint Discovery")
      setProgress(30)

      const crawlerResponse = await fetch("/api/web-crawler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: `https://${sanitizedTarget}`, maxDepth: 2 }),
      })

      if (!crawlerResponse.ok) {
        throw new Error(`Web crawling failed: ${crawlerResponse.statusText}`)
      }

      const crawlerData = await crawlerResponse.json()
      setResults((prev) => ({ ...prev, crawler: crawlerData }))
      setProgress(60)

      setCurrentPhase("Advanced Vulnerability Assessment")
      setProgress(65)

      const endpoints = [
        `https://${sanitizedTarget}`,
        ...(crawlerData.crawlResults?.slice(0, 5).map((r: any) => r.url) || []),
      ]

      const vulnResponse = await fetch("/api/advanced-vuln-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoints }),
      })

      if (!vulnResponse.ok) {
        throw new Error(`Vulnerability scan failed: ${vulnResponse.statusText}`)
      }

      const vulnData = await vulnResponse.json()
      setResults((prev) => ({ ...prev, vulnerabilities: vulnData }))
      setProgress(100)

      setCurrentPhase("Scan Complete")

      const scanRecord = {
        target: sanitizedTarget,
        timestamp: new Date().toISOString(),
        summary: {
          dns: dnsData.dnsResults?.length || 0,
          pages: crawlerData.summary?.totalPages || 0,
          vulnerabilities: vulnData.summary?.totalVulnerabilities || 0,
        },
      }
      setScanHistory((prev) => [scanRecord, ...prev.slice(0, 9)])
    } catch (error) {
      console.error("Scan failed:", error)
      setCurrentPhase("Scan Failed")
      setError(error instanceof Error ? error.message : "An unexpected error occurred during scanning")
    } finally {
      setScanning(false)
    }
  }

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTarget(value)
    setError("")

    if (value && !isValidDomain(sanitizeTarget(value))) {
      setError("Invalid domain format")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-primary-green/20">
        <CardHeader>
          <CardTitle className="text-lime-green flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ultimate Security Scanner
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comprehensive security assessment with DNS analysis, web crawling, and vulnerability detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter domain (e.g., example.com)"
              value={target}
              onChange={handleTargetChange}
              className="bg-black/60 border-primary-green/30 text-white"
              disabled={scanning}
            />
            <Button
              onClick={runComprehensiveScan}
              disabled={scanning || !target || !!error}
              className="bg-primary-green hover:bg-vibrant-green text-black font-semibold px-8"
            >
              {scanning ? "Scanning..." : "Start Scan"}
            </Button>
          </div>

          {error && (
            <div className="text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {scanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{currentPhase}</span>
                <span className="text-lime-green">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-black/40 border-primary-green/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dns">DNS Analysis</TabsTrigger>
            <TabsTrigger value="crawler">Web Crawling</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-black/40 border-primary-green/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">DNS Records</p>
                      <p className="text-2xl font-bold text-white">{results.dns?.dnsResults?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-primary-green/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Pages Crawled</p>
                      <p className="text-2xl font-bold text-white">{results.crawler?.summary?.totalPages || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-primary-green/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-sm text-gray-400">Vulnerabilities</p>
                      <p className="text-2xl font-bold text-white">
                        {results.vulnerabilities?.summary?.totalVulnerabilities || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {results.vulnerabilities?.summary && (
              <Card className="bg-black/40 border-primary-green/20">
                <CardHeader>
                  <CardTitle className="text-lime-green">Vulnerability Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {results.vulnerabilities.summary.criticalVulns}
                      </div>
                      <div className="text-sm text-gray-400">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {results.vulnerabilities.summary.highVulns}
                      </div>
                      <div className="text-sm text-gray-400">High</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {results.vulnerabilities.summary.mediumVulns}
                      </div>
                      <div className="text-sm text-gray-400">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{results.vulnerabilities.summary.lowVulns}</div>
                      <div className="text-sm text-gray-400">Low</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dns" className="space-y-4">
            {results.dns?.dnsResults?.map((record: any, index: number) => (
              <Card key={index} className="bg-black/40 border-primary-green/20">
                <CardHeader>
                  <CardTitle className="text-lime-green text-lg">{record.type} Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {record.records.length > 0 ? (
                    <div className="space-y-2">
                      {record.records.map((value: string, i: number) => (
                        <div key={i} className="bg-black/60 p-2 rounded font-mono text-sm text-gray-300">
                          {value}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No {record.type} records found</p>
                  )}
                  {record.notes && (
                    <div className="mt-2 space-y-1">
                      {record.notes.map((note: string, i: number) => (
                        <div key={i} className="text-yellow-400 text-sm flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="crawler" className="space-y-4">
            {results.crawler?.crawlResults?.map((page: any, index: number) => (
              <Card key={index} className="bg-black/40 border-primary-green/20">
                <CardHeader>
                  <CardTitle className="text-lime-green text-lg flex items-center gap-2">
                    {page.status === 200 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    {page.url}
                  </CardTitle>
                  <CardDescription>
                    Status: {page.status} | Title: {page.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {page.technologies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-1">
                        {page.technologies.map((tech: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-blue-500/20 text-blue-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {page.forms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Forms Found</h4>
                      {page.forms.map((form: any, i: number) => (
                        <div key={i} className="bg-black/60 p-2 rounded text-sm">
                          <span className="text-lime-green">{form.method}</span> {form.action}
                          {!form.hasCSRF && form.method === "POST" && (
                            <Badge className="ml-2 bg-red-500/20 text-red-300">No CSRF</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {page.notes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Security Issues</h4>
                      {page.notes.map((note: string, i: number) => (
                        <div key={i} className="text-yellow-400 text-sm flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-4">
            {results.vulnerabilities?.results?.map((result: any, index: number) => (
              <Card key={index} className="bg-black/40 border-primary-green/20">
                <CardHeader>
                  <CardTitle className="text-lime-green text-lg">{result.endpoint}</CardTitle>
                  <CardDescription>
                    Response Time: {result.responseTime}ms | Status: {result.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.vulnerabilities.length > 0 ? (
                    <div className="space-y-3">
                      {result.vulnerabilities.map((vuln: any, i: number) => (
                        <div key={i} className="border border-gray-700 rounded p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getSeverityColor(vuln.severity)} text-white`}>{vuln.severity}</Badge>
                            <span className="font-semibold text-white">{vuln.type.replace("_", " ")}</span>
                            {vuln.cvss && <span className="text-sm text-gray-400">CVSS: {vuln.cvss}</span>}
                          </div>
                          <p className="text-gray-300 mb-2">{vuln.description}</p>
                          {vuln.payload && (
                            <div className="bg-black/60 p-2 rounded font-mono text-sm text-red-300 mb-2">
                              Payload: {vuln.payload}
                            </div>
                          )}
                          {vuln.evidence && (
                            <div className="bg-black/60 p-2 rounded font-mono text-sm text-yellow-300 mb-2">
                              Evidence: {vuln.evidence}
                            </div>
                          )}
                          <p className="text-green-300 text-sm">
                            <strong>Recommendation:</strong> {vuln.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      No vulnerabilities detected
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      {scanHistory.length > 0 && (
        <Card className="bg-black/40 border-primary-green/20">
          <CardHeader>
            <CardTitle className="text-lime-green flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((scan, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-black/60 rounded">
                  <div>
                    <span className="text-white font-medium">{scan.target}</span>
                    <span className="text-gray-400 text-sm ml-2">{new Date(scan.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-400">{scan.summary.dns} DNS</span>
                    <span className="text-green-400">{scan.summary.pages} Pages</span>
                    <span className="text-red-400">{scan.summary.vulnerabilities} Vulns</span>
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
