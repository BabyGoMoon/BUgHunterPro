"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Network, Play, Square, Download, Shield, AlertTriangle, CheckCircle, X } from "lucide-react"

interface PortResult {
  port: number
  protocol: "TCP" | "UDP"
  status: "open" | "closed" | "filtered"
  service: string
  version?: string
  banner?: string
}

const mockPortResults: PortResult[] = [
  { port: 21, protocol: "TCP", status: "closed", service: "FTP" },
  { port: 22, protocol: "TCP", status: "open", service: "SSH", version: "OpenSSH 8.2", banner: "SSH-2.0-OpenSSH_8.2" },
  { port: 23, protocol: "TCP", status: "closed", service: "Telnet" },
  { port: 25, protocol: "TCP", status: "filtered", service: "SMTP" },
  { port: 53, protocol: "UDP", status: "open", service: "DNS", version: "BIND 9.16.1" },
  { port: 80, protocol: "TCP", status: "open", service: "HTTP", version: "Apache 2.4.41", banner: "Apache/2.4.41" },
  { port: 110, protocol: "TCP", status: "closed", service: "POP3" },
  { port: 143, protocol: "TCP", status: "closed", service: "IMAP" },
  { port: 443, protocol: "TCP", status: "open", service: "HTTPS", version: "Apache 2.4.41", banner: "Apache/2.4.41" },
  { port: 993, protocol: "TCP", status: "closed", service: "IMAPS" },
  { port: 995, protocol: "TCP", status: "closed", service: "POP3S" },
  { port: 3306, protocol: "TCP", status: "filtered", service: "MySQL" },
  { port: 5432, protocol: "TCP", status: "closed", service: "PostgreSQL" },
  { port: 8080, protocol: "TCP", status: "open", service: "HTTP-Alt", version: "Nginx 1.18.0" },
]

const scanTypes = [
  { value: "quick", label: "Quick Scan (Top 100 ports)" },
  { value: "common", label: "Common Ports (Top 1000)" },
  { value: "full", label: "Full Scan (All 65535 ports)" },
  { value: "custom", label: "Custom Port Range" },
]

export function PortScanner() {
  const [target, setTarget] = useState("scanme.nmap.org")
  const [scanType, setScanType] = useState("quick")
  const [customPorts, setCustomPorts] = useState("80,443,22,21,25")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<PortResult[]>([])
  const [visibleResults, setVisibleResults] = useState<PortResult[]>([])
  const [currentPort, setCurrentPort] = useState<number | null>(null)

  const handleScan = () => {
    setIsScanning(true)
    setProgress(0)
    setResults([])
    setVisibleResults([])
    setCurrentPort(null)

    // Simulate scanning with port updates
    let portIndex = 0
    const portsToScan = mockPortResults.map((r) => r.port)

    const scanInterval = setInterval(() => {
      if (portIndex < portsToScan.length) {
        setCurrentPort(portsToScan[portIndex])
        setProgress(((portIndex + 1) / portsToScan.length) * 100)
        portIndex++
      } else {
        clearInterval(scanInterval)
        setIsScanning(false)
        setCurrentPort(null)
        setResults(mockPortResults)
      }
    }, 200)
  }

  const handleStop = () => {
    setIsScanning(false)
    setCurrentPort(null)
    setResults(mockPortResults.slice(0, Math.floor(mockPortResults.length * (progress / 100))))
  }

  // Animate results appearing
  useEffect(() => {
    if (results.length > 0 && !isScanning) {
      let index = 0
      const showResult = () => {
        if (index < results.length) {
          setVisibleResults((prev) => [...prev, results[index]])
          index++
          setTimeout(showResult, 100)
        }
      }
      showResult()
    }
  }, [results, isScanning])

  const getStatusColor = (status: PortResult["status"]) => {
    switch (status) {
      case "open":
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
      case "closed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "filtered":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    }
  }

  const getStatusIcon = (status: PortResult["status"]) => {
    switch (status) {
      case "open":
        return <CheckCircle className="h-4 w-4 text-primary-green" />
      case "closed":
        return <X className="h-4 w-4 text-red-400" />
      case "filtered":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
    }
  }

  const openPorts = visibleResults.filter((r) => r.status === "open").length
  const closedPorts = visibleResults.filter((r) => r.status === "closed").length
  const filteredPorts = visibleResults.filter((r) => r.status === "filtered").length

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
            <Network className="h-6 w-6 text-primary-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Port Scanner</h1>
            <p className="text-foreground/60">Fast and accurate port scanning with service detection</p>
          </div>
        </div>

        {/* Scan Configuration */}
        <Card className="glass-panel p-6">
          <div className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Target Host</label>
                <div className="relative">
                  <Network className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter IP address or hostname"
                    className="pl-10 bg-background/50 border-primary-green/20 focus:border-primary-green/40"
                    disabled={isScanning}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Scan Type</label>
                <Select value={scanType} onValueChange={setScanType} disabled={isScanning}>
                  <SelectTrigger className="bg-background/50 border-primary-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scanTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {scanType === "custom" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Custom Ports</label>
                <Input
                  value={customPorts}
                  onChange={(e) => setCustomPorts(e.target.value)}
                  placeholder="Enter ports (e.g., 80,443,22-25,8000-8080)"
                  className="bg-background/50 border-primary-green/20 focus:border-primary-green/40"
                  disabled={isScanning}
                />
              </div>
            )}

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={handleScan} className="cyber-button">
                  <Play className="h-4 w-4 mr-2" />
                  Start Scan
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Scan
                </Button>
              )}
              {results.length > 0 && (
                <Button variant="outline" className="border-primary-green/20 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              )}
            </div>

            {/* Progress */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Scanning ports... {currentPort && <span className="text-primary-green">Port {currentPort}</span>}
                  </span>
                  <span className="text-primary-green">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary-green to-vibrant-green transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      {visibleResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-primary-green">{openPorts}</div>
            <div className="text-sm text-foreground/60">Open Ports</div>
          </Card>
          <Card className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{closedPorts}</div>
            <div className="text-sm text-foreground/60">Closed Ports</div>
          </Card>
          <Card className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{filteredPorts}</div>
            <div className="text-sm text-foreground/60">Filtered Ports</div>
          </Card>
          <Card className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{visibleResults.length}</div>
            <div className="text-sm text-foreground/60">Total Scanned</div>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {visibleResults.length > 0 && (
        <Card className="glass-panel p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-green">Scan Results</h3>
              <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20">
                {visibleResults.length} ports scanned
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary-green/20">
                    <TableHead className="text-primary-green">Port</TableHead>
                    <TableHead className="text-primary-green">Protocol</TableHead>
                    <TableHead className="text-primary-green">Status</TableHead>
                    <TableHead className="text-primary-green">Service</TableHead>
                    <TableHead className="text-primary-green">Version</TableHead>
                    <TableHead className="text-primary-green">Banner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleResults.map((result, index) => (
                    <TableRow
                      key={`${result.port}-${result.protocol}`}
                      className="border-primary-green/10 hover:bg-primary-green/5 animate-in slide-in-from-bottom duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-mono font-medium">{result.port}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {result.protocol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <Badge variant="outline" className={`text-xs ${getStatusColor(result.status)}`}>
                            {result.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{result.service}</TableCell>
                      <TableCell className="font-mono text-sm text-foreground/80">{result.version || "-"}</TableCell>
                      <TableCell className="font-mono text-xs text-foreground/60 max-w-xs truncate">
                        {result.banner || "-"}
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
      {!isScanning && visibleResults.length === 0 && (
        <Card className="glass-panel p-12 text-center">
          <Network className="h-16 w-16 text-primary-green/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Scan Ports</h3>
          <p className="text-foreground/60 mb-6">
            Enter a target host and select a scan type to discover open ports and running services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground/60">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary-green" />
              <span>Service Detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary-green" />
              <span>Version Identification</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary-green" />
              <span>Banner Grabbing</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
