"use client"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Check, Loader2, Globe, Shield, Zap, Brain, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export function UltimateSubdomainScanner() {
  const [domain, setDomain] = useState("")
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleScan = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain name")
      return
    }

    setIsLoading(true)
    setError("")
    setScanResult(null)

    try {
      const response = await fetch("/api/ultimate-subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      })

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`)
      }

      const data = await response.json()
      setScanResult(data)
    } catch (err) {
      console.error("Scan error:", err)
      setError(err instanceof Error ? err.message : "Scan failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleScan()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Globe className="w-10 h-10 text-primary-green" />
            Ultimate Subdomain Scanner
          </h1>
          <p className="text-gray-400 text-lg">Advanced multi-source reconnaissance with AI-powered discovery</p>
        </motion.div>

        {/* Scan Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter domain (e.g., example.com)"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-green"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={isLoading || !domain.trim()}
                  className="bg-primary-green hover:bg-vibrant-green text-black font-semibold px-8"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Scanning...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="scan"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Zap className="w-4 h-4" />
                        Scan Now
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Scan Results */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-green">{scanResult.liveSubdomainsCount}</div>
                    <div className="text-sm text-gray-400">Live Subdomains</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{scanResult.totalCandidates}</div>
                    <div className="text-sm text-gray-400">Total Scanned</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {scanResult.sources.certificateTransparency}
                    </div>
                    <div className="text-sm text-gray-400">From Certificates</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">{scanResult.sources.aiSuggestions}</div>
                    <div className="text-sm text-gray-400">AI Suggestions</div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Subdomains */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-green" />
                    Live Subdomains for {scanResult.domain}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scanResult.liveSubdomains.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                      {scanResult.liveSubdomains.map((subdomain, index) => (
                        <motion.div
                          key={subdomain}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Check className="w-4 h-4 text-primary-green flex-shrink-0" />
                          <span className="text-white text-sm font-mono truncate">{subdomain}</span>
                          {subdomain.includes("admin") || subdomain.includes("dev") || subdomain.includes("staging") ? (
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                              High Interest
                            </Badge>
                          ) : null}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No live subdomains found for this domain.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scan Sources */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Scan Sources & Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-lg font-semibold text-blue-400">{scanResult.sources.wordlist}</div>
                      <div className="text-sm text-gray-400">Wordlist Brute Force</div>
                      <div className="text-xs text-gray-500 mt-1">Comprehensive dictionary attack</div>
                    </div>

                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-lg font-semibold text-purple-400">
                        {scanResult.sources.certificateTransparency}
                      </div>
                      <div className="text-sm text-gray-400">Certificate Logs</div>
                      <div className="text-xs text-gray-500 mt-1">SSL certificate transparency</div>
                    </div>

                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-lg font-semibold text-orange-400">{scanResult.sources.aiSuggestions}</div>
                      <div className="text-sm text-gray-400">AI Suggestions</div>
                      <div className="text-xs text-gray-500 mt-1">Machine learning predictions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
