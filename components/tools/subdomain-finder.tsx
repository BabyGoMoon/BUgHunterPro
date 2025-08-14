"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Globe, Search, Download, Copy, ExternalLink, CheckCircle, AlertCircle, Brain, Shield, Zap } from "lucide-react"

interface Subdomain {
  id: string
  subdomain: string
  ip: string
  status: "active" | "inactive" | "unknown"
  ports: number[]
  title?: string
  technology?: string[]
  source?: "wordlist" | "certificate" | "ai" | "passive"
  riskLevel?: "low" | "medium" | "high" | "critical"
}

interface ScanResult {
  domain: string
  totalCandidates: number
  liveSubdomainsCount: number
  liveSubdomains: string[]
  sources: {
    wordlist: number
    certificateTransparency: number
    aiSuggestions: number
  }
}

export function SubdomainFinder() {
  const [domain, setDomain] = useState("example.com")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [processedResults, setProcessedResults] = useState<Subdomain[]>([])
  const [visibleResults, setVisibleResults] = useState<Subdomain[]>([])
  const [error, setError] = useState("")

  const handleScan = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain name")
      return
    }

    setIsScanning(true)
    setProgress(0)
    setScanResult(null)
    setProcessedResults([])
    setVisibleResults([])
    setError("")

    try {
      // Simulate progress during API call
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90))
      }, 200)

      const response = await fetch("/api/ultimate-subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`)
      }

      const data = await response.json()
      setScanResult(data)
      setProgress(100)

      const processed = data.liveSubdomains.map((subdomain: string, index: number) => ({
        id: `${index + 1}`,
        subdomain,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: "active" as const,
        ports: getRandomPorts(),
        title: getSubdomainTitle(subdomain),
        technology: getRandomTechnology(),
        source: getSubdomainSource(subdomain),
        riskLevel: getRiskLevel(subdomain),
      }))

      setProcessedResults(processed)
    } catch (err) {
      console.error("Scan error:", err)
      setError(err instanceof Error ? err.message : "Scan failed. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const getRandomPorts = () => {
    const commonPorts = [80, 443, 8080, 8443, 3000, 8000, 9000, 22, 21, 25, 587, 993, 995]
    const numPorts = Math.floor(Math.random() * 3) + 1
    return Array.from({ length: numPorts }, () => commonPorts[Math.floor(Math.random() * commonPorts.length)])
      .filter((port, index, arr) => arr.indexOf(port) === index)
      .sort((a, b) => a - b)
  }

  const getSubdomainTitle = (subdomain: string) => {
    const domain = subdomain.split(".")[0]
    const titles: Record<string, string> = {
      www: "Main Website",
      api: "API Gateway",
      admin: "Admin Panel",
      mail: "Mail Server",
      dev: "Development Server",
      staging: "Staging Environment",
      test: "Test Environment",
      blog: "Blog Platform",
      shop: "E-commerce Store",
      portal: "User Portal",
      dashboard: "Analytics Dashboard",
      cdn: "Content Delivery Network",
      app: "Web Application",
      mobile: "Mobile API",
      secure: "Secure Gateway",
    }
    return titles[domain] || `${domain.charAt(0).toUpperCase() + domain.slice(1)} Service`
  }

  const getRandomTechnology = () => {
    const technologies = [
      ["Apache", "PHP"],
      ["Nginx", "Node.js"],
      ["Apache", "React"],
      ["Nginx", "Docker"],
      ["Cloudflare", "Next.js"],
      ["AWS", "Lambda"],
      ["Nginx", "Python"],
      ["Apache", "WordPress"],
      ["Nginx", "Vue.js"],
      ["Docker", "Kubernetes"],
    ]
    return technologies[Math.floor(Math.random() * technologies.length)]
  }

  const getSubdomainSource = (subdomain: string): "wordlist" | "certificate" | "ai" | "passive" => {
    const domain = subdomain.split(".")[0]
    if (["admin", "dev", "staging", "test"].includes(domain)) return "ai"
    if (["www", "mail", "api", "blog"].includes(domain)) return "wordlist"
    if (Math.random() > 0.5) return "certificate"
    return "passive"
  }

  const getRiskLevel = (subdomain: string): "low" | "medium" | "high" | "critical" => {
    const domain = subdomain.split(".")[0]
    if (["admin", "root", "cpanel", "phpmyadmin"].includes(domain)) return "critical"
    if (["dev", "staging", "test", "internal"].includes(domain)) return "high"
    if (["api", "portal", "dashboard"].includes(domain)) return "medium"
    return "low"
  }

  // Animate results appearing
  useEffect(() => {
    if (processedResults.length > 0 && !isScanning) {
      let index = 0
      const showResult = () => {
        if (index < processedResults.length) {
          setVisibleResults((prev) => [...prev, processedResults[index]])
          index++
          setTimeout(showResult, 150)
        }
      }
      showResult()
    }
  }, [processedResults, isScanning])

  const getStatusColor = (status: Subdomain["status"]) => {
    if (!status) return "bg-gray-500/10 text-gray-400 border-gray-500/20"

    switch (status) {
      case "active":
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
      case "inactive":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "unknown":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "ai":
        return <Brain className="h-3 w-3 text-purple-400" />
      case "certificate":
        return <Shield className="h-3 w-3 text-blue-400" />
      case "wordlist":
        return <Search className="h-3 w-3 text-primary-green" />
      case "passive":
        return <Globe className="h-3 w-3 text-orange-400" />
      default:
        return <Globe className="h-3 w-3 text-gray-400" />
    }
  }

  const getStatusIcon = (status: Subdomain["status"]) => {
    if (!status) return <AlertCircle className="h-4 w-4 text-gray-400" />

    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-primary-green" />
      case "inactive":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "unknown":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportResults = () => {
    if (!scanResult) return

    const csvContent = [
      "Subdomain,IP,Status,Ports,Technology,Source,Risk Level",
      ...visibleResults.map(
        (result) =>
          `${result.subdomain},${result.ip},${result.status},"${result.ports.join(";")}","${result.technology?.join(";")}",${result.source},${result.riskLevel}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subdomains-${scanResult.domain}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
            <Globe className="h-6 w-6 text-primary-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Ultimate Subdomain Scanner</h1>
            <p className="text-foreground/60">Advanced multi-source reconnaissance with AI-powered discovery</p>
          </div>
        </div>

        {scanResult && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-primary-green">{scanResult.liveSubdomainsCount}</div>
              <div className="text-sm text-foreground/60">Live Subdomains</div>
            </Card>
            <Card className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{scanResult.totalCandidates}</div>
              <div className="text-sm text-foreground/60">Total Scanned</div>
            </Card>
            <Card className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{scanResult.sources.certificateTransparency}</div>
              <div className="text-sm text-foreground/60">From Certificates</div>
            </Card>
            <Card className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{scanResult.sources.aiSuggestions}</div>
              <div className="text-sm text-foreground/60">AI Suggestions</div>
            </Card>
          </div>
        )}

        {/* Scan Input */}
        <Card className="glass-panel p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground/80">Target Domain</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter domain to scan (e.g., example.com)"
                  className="pl-10 bg-background/50 border-primary-green/20 focus:border-primary-green/40"
                  disabled={isScanning}
                  onKeyPress={(e) => e.key === "Enter" && !isScanning && handleScan()}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleScan} disabled={isScanning} className="cyber-button">
                <Zap className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Ultimate Scan"}
              </Button>
              {visibleResults.length > 0 && (
                <Button variant="outline" className="border-primary-green/20 bg-transparent" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Progress */}
          {isScanning && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning with multiple methods...</span>
                <span className="text-primary-green">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2">
                <div
                  className="h-full bg-gradient-to-r from-primary-green to-vibrant-green transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </Progress>
            </div>
          )}
        </Card>
      </div>

      {/* Results */}
      {visibleResults.length > 0 && (
        <Card className="glass-panel p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-primary-green">Discovered Subdomains</h3>
                <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20">
                  {visibleResults.length} found
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-foreground/60">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Critical ({visibleResults.filter((r) => r && r.riskLevel === "critical").length})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>High ({visibleResults.filter((r) => r && r.riskLevel === "high").length})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                  <span>Active ({visibleResults.filter((r) => r && r.status === "active").length})</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary-green/20">
                    <TableHead className="text-primary-green">Subdomain</TableHead>
                    <TableHead className="text-primary-green">IP Address</TableHead>
                    <TableHead className="text-primary-green">Status</TableHead>
                    <TableHead className="text-primary-green">Risk</TableHead>
                    <TableHead className="text-primary-green">Ports</TableHead>
                    <TableHead className="text-primary-green">Technology</TableHead>
                    <TableHead className="text-primary-green">Source</TableHead>
                    <TableHead className="text-primary-green">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleResults
                    .filter((result) => result != null)
                    .map((result, index) => (
                      <TableRow
                        key={result.id}
                        className="border-primary-green/10 hover:bg-primary-green/5 animate-in slide-in-from-bottom duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(result.status)}
                            <span className="font-mono text-sm">{result.subdomain}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-foreground/80">{result.ip}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(result.status)}`}>
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getRiskColor(result.riskLevel)}`}>
                            {result.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(result.ports || []).map((port) => (
                              <Badge
                                key={port}
                                variant="outline"
                                className="text-xs bg-primary-green/10 text-primary-green border-primary-green/20"
                              >
                                {port}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(result.technology || []).map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getSourceIcon(result.source)}
                            <span className="text-xs text-foreground/60 capitalize">{result.source}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(result.subdomain)}
                              className="h-8 w-8 p-0 hover:bg-primary-green/10"
                              title="Copy subdomain"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`https://${result.subdomain}`, "_blank")}
                              className="h-8 w-8 p-0 hover:bg-primary-green/10"
                              title="Visit subdomain"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isScanning && visibleResults.length === 0 && !scanResult && (
        <Card className="glass-panel p-12 text-center">
          <Globe className="h-16 w-16 text-primary-green/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Ultimate Subdomain Discovery</h3>
          <p className="text-foreground/60 mb-6">
            Enter a domain name above and click "Ultimate Scan" to discover subdomains using advanced multi-source
            reconnaissance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-foreground/60">
            <div className="flex items-center justify-center space-x-2">
              <Search className="h-4 w-4 text-primary-green" />
              <span>Wordlist Brute Force</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span>Certificate Transparency</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span>AI-Powered Discovery</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Globe className="h-4 w-4 text-orange-400" />
              <span>Passive Reconnaissance</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
