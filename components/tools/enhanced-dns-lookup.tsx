"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Server, Globe, Shield, Mail } from "lucide-react"
import { motion } from "framer-motion"

interface DNSData {
  A: string[]
  AAAA: string[]
  MX: Array<{ exchange: string; priority: number }>
  CNAME: string[]
  NS: string[]
  TXT: string[][]
  SOA: {
    nsname: string
    hostmaster: string
    serial: number
    refresh: number
    retry: number
    expire: number
    minttl: number
  } | null
}

export function EnhancedDNSLookup() {
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<DNSData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLookup = async () => {
    if (!domain.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
      const response = await fetch(`/api/dns-lookup?domain=${encodeURIComponent(cleanDomain)}`)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "DNS lookup failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getTotalRecords = (data: DNSData) => {
    return data.A.length + data.AAAA.length + data.MX.length + data.CNAME.length + data.NS.length + data.TXT.length
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-primary-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-green">
            <Server className="h-5 w-5" />
            Enhanced DNS Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter domain (example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLookup()}
              className="flex-1 bg-background/50 border-primary-green/20 focus:border-primary-green/40"
            />
            <Button onClick={handleLookup} disabled={loading || !domain.trim()} className="cyber-button">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Resolving..." : "Lookup"}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-critical/10 border border-critical/20 text-critical">{error}</div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-green">{getTotalRecords(result)}</div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-vibrant-green">{result.A.length}</div>
                    <div className="text-sm text-muted-foreground">A Records</div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-lime-green">{result.MX.length}</div>
                    <div className="text-sm text-muted-foreground">MX Records</div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-green">{result.NS.length}</div>
                    <div className="text-sm text-muted-foreground">NS Records</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="a-records" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="a-records">A Records</TabsTrigger>
                  <TabsTrigger value="mx-records">MX Records</TabsTrigger>
                  <TabsTrigger value="ns-records">NS Records</TabsTrigger>
                  <TabsTrigger value="txt-records">TXT Records</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                  <TabsTrigger value="soa">SOA</TabsTrigger>
                </TabsList>

                <TabsContent value="a-records" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />A Records (IPv4)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.A.length > 0 ? (
                        result.A.map((ip, index) => (
                          <div
                            key={index}
                            className="font-mono text-sm bg-background/50 p-3 rounded border border-primary-green/10"
                          >
                            {ip}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-center py-4">No A records found</div>
                      )}

                      {result.AAAA.length > 0 && (
                        <>
                          <div className="text-sm font-semibold text-primary-green mt-4 mb-2">AAAA Records (IPv6)</div>
                          {result.AAAA.map((ip, index) => (
                            <div
                              key={index}
                              className="font-mono text-sm bg-background/50 p-3 rounded border border-primary-green/10"
                            >
                              {ip}
                            </div>
                          ))}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mx-records" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        MX Records (Mail Exchange)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.MX.length > 0 ? (
                        result.MX.map((mx, index) => (
                          <div key={index} className="bg-background/50 p-3 rounded border border-primary-green/10">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm">{mx.exchange}</span>
                              <Badge variant="outline" className="border-primary-green/20">
                                Priority: {mx.priority}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-center py-4">No MX records found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ns-records" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        NS Records (Name Servers)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.NS.length > 0 ? (
                        result.NS.map((ns, index) => (
                          <div
                            key={index}
                            className="font-mono text-sm bg-background/50 p-3 rounded border border-primary-green/10"
                          >
                            {ns}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-center py-4">No NS records found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="txt-records" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        TXT Records
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.TXT.length > 0 ? (
                        result.TXT.map((txt, index) => (
                          <div key={index} className="bg-background/50 p-3 rounded border border-primary-green/10">
                            <div className="font-mono text-xs break-all">
                              {Array.isArray(txt) ? txt.join(" ") : txt}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-center py-4">No TXT records found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="other" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle>CNAME Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.CNAME.length > 0 ? (
                        result.CNAME.map((cname, index) => (
                          <div
                            key={index}
                            className="font-mono text-sm bg-background/50 p-3 rounded border border-primary-green/10"
                          >
                            {cname}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-center py-4">No CNAME records found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="soa" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle>SOA Record (Start of Authority)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.SOA ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Primary NS:</span>
                              <div className="font-mono text-sm">{result.SOA.nsname}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Hostmaster:</span>
                              <div className="font-mono text-sm">{result.SOA.hostmaster}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Serial:</span>
                              <div className="font-mono text-sm">{result.SOA.serial}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Refresh:</span>
                              <div className="font-mono text-sm">{result.SOA.refresh}s</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Retry:</span>
                              <div className="font-mono text-sm">{result.SOA.retry}s</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expire:</span>
                              <div className="font-mono text-sm">{result.SOA.expire}s</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-center py-4">No SOA record found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
