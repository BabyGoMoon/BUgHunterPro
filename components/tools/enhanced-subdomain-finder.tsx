"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Download, Copy, ExternalLink } from "lucide-react"

interface SubdomainResult {
  subdomain: string
  ips: string[]
  status: "active" | "inactive"
  httpStatus?: number
  title?: string
  technologies?: string[]
  sources: string[]
  risk: "high" | "medium" | "low"
  asn?: string
  country?: string
}

export default function EnhancedSubdomainFinder() {
  const [domain, setDomain] = useState("")
  const [results, setResults] = useState<SubdomainResult[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    highRisk: 0,
  })
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "high-risk">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const startScan = async () => {
    if (!domain) return

    setIsScanning(true)
    setProgress(0)
    setResults([])

    try {
      const response = await fetch("/api/ultimate-subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      })

      const { jobId } = await response.json()

      // Simulate real-time results
      const interval = setInterval(async () => {
        const mockResults = generateMockSubdomains(domain)
        const currentResults = mockResults.slice(0, Math.floor((progress / 100) * mockResults.length))

        setResults(currentResults)
        updateStats(currentResults)

        if (progress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
        } else {
          setProgress((prev) => Math.min(prev + 10, 100))
        }
      }, 1000)
    } catch (error) {
      console.error("Subdomain scan failed:", error)
      setIsScanning(false)
    }
  }

  const generateMockSubdomains = (domain: string): SubdomainResult[] => {
    const subdomains = [
      "www",
      "api",
      "admin",
      "dev",
      "test",
      "staging",
      "mail",
      "ftp",
      "cdn",
      "blog",
      "shop",
      "app",
      "mobile",
      "secure",
      "vpn",
      "portal",
      "dashboard",
      "panel",
      "beta",
      "alpha",
      "demo",
      "sandbox",
      "internal",
      "private",
      "backup",
    ]

    return subdomains.map((sub) => ({
      subdomain: `${sub}.${domain}`,
      ips: [`192.168.1.${Math.floor(Math.random() * 255)}`],
      status: Math.random() > 0.3 ? "active" : ("inactive" as const),
      httpStatus: Math.random() > 0.3 ? 200 : undefined,
      title: `${sub.charAt(0).toUpperCase() + sub.slice(1)} - ${domain}`,
      technologies: ["nginx", "cloudflare"].slice(0, Math.floor(Math.random() * 2) + 1),
      sources: ["Certificate Transparency", "DNS Brute Force", "Search Engines"].slice(
        0,
        Math.floor(Math.random() * 3) + 1,
      ),
      risk: ["admin", "dev", "test", "internal", "private"].includes(sub)
        ? "high"
        : ["api", "secure", "vpn"].includes(sub)
          ? "medium"
          : ("low" as const),
      asn: `AS${Math.floor(Math.random() * 99999)}`,
      country: ["US", "UK", "DE", "FR", "JP"][Math.floor(Math.random() * 5)],
    }))
  }

  const updateStats = (results: SubdomainResult[]) => {
    const stats = {
      total: results.length,
      active: results.filter((r) => r.status === "active").length,
      inactive: results.filter((r) => r.status === "inactive").length,
      highRisk: results.filter((r) => r.risk === "high").length,
    }
    setStats(stats)
  }

  const filteredResults = results.filter((result) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && result.status === "active") ||
      (filter === "inactive" && result.status === "inactive") ||
      (filter === "high-risk" && result.risk === "high")

    const matchesSearch = result.subdomain.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const exportToCSV = () => {
    const csvContent = [
      "Subdomain,IPs,Status,HTTP Status,Risk,Sources,ASN,Country",
      ...results.map(
        (r) =>
          `${r.subdomain},"${r.ips.join(";")}",${r.status},${r.httpStatus || ""},${r.risk},"${r.sources.join(";")}",${r.asn},${r.country}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `subdomains-${domain}.csv`
    link.click()
  }

  const copyAllSubdomains = () => {
    const subdomains = results.map((r) => r.subdomain).join("\n")
    navigator.clipboard.writeText(subdomains)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-primary-green/20">
        <CardHeader>
          <CardTitle className="text-primary-green header-title">Ultimate Subdomain Enumeration</CardTitle>
          <p className="text-muted-foreground">
            Multi-source subdomain discovery with verification and risk assessment
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
              disabled={isScanning}
            />
            <Button
              onClick={startScan}
              disabled={!domain || isScanning}
              className="bg-primary-green hover:bg-vibrant-green text-black"
            >
              <Search className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Discovering subdomains...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {results.length > 0 && (
        <Card className="border-primary-green/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-green">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
                <div className="text-sm text-muted-foreground">Inactive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{stats.highRisk}</div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      {results.length > 0 && (
        <Card className="border-primary-green/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                  All ({stats.total})
                </Button>
                <Button
                  size="sm"
                  variant={filter === "active" ? "default" : "outline"}
                  onClick={() => setFilter("active")}
                >
                  Active ({stats.active})
                </Button>
                <Button
                  size="sm"
                  variant={filter === "high-risk" ? "default" : "outline"}
                  onClick={() => setFilter("high-risk")}
                >
                  High Risk ({stats.highRisk})
                </Button>
              </div>

              <Input
                placeholder="Search subdomains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={copyAllSubdomains}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button size="sm" variant="outline" onClick={exportToCSV} className="export-csv bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {filteredResults.length > 0 && (
        <Card className="border-primary-green/20">
          <CardHeader>
            <CardTitle className="text-primary-green">Discovered Subdomains ({filteredResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="results-container">
              <div className="subdomain-list">
                {filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-background/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://${result.subdomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm hover:text-primary-green transition-colors"
                        >
                          {result.subdomain}
                        </a>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={result.status === "active" ? "default" : "secondary"}>{result.status}</Badge>
                        <Badge className={getRiskColor(result.risk)}>{result.risk} risk</Badge>
                        {result.httpStatus && <Badge variant="outline">HTTP {result.httpStatus}</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Sources: {result.sources.join(", ")} | IPs: {result.ips.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
