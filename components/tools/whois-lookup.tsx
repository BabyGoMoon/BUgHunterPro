"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Calendar, Shield, Mail, Server, Building } from "lucide-react"
import { motion } from "framer-motion"

interface WhoisData {
  domainName: string
  registrar: string
  creationDate: string
  expirationDate: string
  updatedDate: string
  nameServers: string[]
  status: string[]
  emails: string[]
  registrantCountry: string
  registrantOrganization: string
  adminContact: string
  techContact: string
  dnssec: string
}

export function WhoisLookup() {
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<WhoisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLookup = async () => {
    if (!domain.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
      const response = await fetch(`/api/whois?domain=${encodeURIComponent(cleanDomain)}`)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "WHOIS lookup failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-primary-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-green">
            <Shield className="h-5 w-5" />
            WHOIS Lookup
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
              {loading ? "Searching..." : "Lookup"}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-critical/10 border border-critical/20 text-critical">{error}</div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary-green font-semibold">
                      <Building className="h-4 w-4" />
                      Domain Information
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Domain:</span> {result.domainName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Registrar:</span> {result.registrar}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Organization:</span> {result.registrantOrganization}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Country:</span> {result.registrantCountry}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">DNSSEC:</span>
                        <Badge variant={result.dnssec === "signedDelegation" ? "default" : "secondary"}>
                          {result.dnssec}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary-green font-semibold">
                      <Calendar className="h-4 w-4" />
                      Important Dates
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created:</span> {formatDate(result.creationDate)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Updated:</span> {formatDate(result.updatedDate)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expires:</span> {formatDate(result.expirationDate)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary-green font-semibold">
                      <Server className="h-4 w-4" />
                      Name Servers
                    </div>
                    <div className="space-y-1 text-sm">
                      {result.nameServers.map((ns, index) => (
                        <div key={index} className="font-mono text-xs bg-background/50 p-2 rounded">
                          {ns}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary-green font-semibold">
                      <Mail className="h-4 w-4" />
                      Contact Information
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Admin:</span> {result.adminContact}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tech:</span> {result.techContact}
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Emails:</span>
                        {result.emails.map((email, index) => (
                          <div key={index} className="font-mono text-xs bg-background/50 p-1 rounded">
                            {email}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-panel border-primary-green/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-primary-green font-semibold mb-3">
                    <Shield className="h-4 w-4" />
                    Domain Status
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.status.map((status, index) => (
                      <Badge key={index} variant="outline" className="border-primary-green/20">
                        {status}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
