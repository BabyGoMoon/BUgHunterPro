"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Globe, Link, Mail, Code, Shield, FileText } from "lucide-react"
import { motion } from "framer-motion"

interface CrawlData {
  visited: string[]
  links: string[]
  scripts: string[]
  emails: string[]
  forms: Array<{
    action: string
    method: string
    fields: string[]
  }>
  technologies: string[]
  securityHeaders: Record<string, string>
}

export function EnhancedWebCrawler() {
  const [target, setTarget] = useState("")
  const [result, setResult] = useState<CrawlData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCrawl = async () => {
    if (!target.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      let url = target
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
      }

      const response = await fetch(`/api/web-crawl?target=${encodeURIComponent(url)}`)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Web crawl failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getSecurityScore = (headers: Record<string, string>) => {
    const total = Object.keys(headers).length
    const missing = Object.values(headers).filter((v) => v === "Missing").length
    return Math.round(((total - missing) / total) * 100)
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-primary-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-green">
            <Globe className="h-5 w-5" />
            Enhanced Web Crawler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter target URL (https://example.com)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCrawl()}
              className="flex-1 bg-background/50 border-primary-green/20 focus:border-primary-green/40"
            />
            <Button onClick={handleCrawl} disabled={loading || !target.trim()} className="cyber-button">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Crawling..." : "Start Crawl"}
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
                    <div className="text-2xl font-bold text-primary-green">{result.visited.length}</div>
                    <div className="text-sm text-muted-foreground">Pages Visited</div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-vibrant-green">{result.links.length}</div>
                    <div className="text-sm text-muted-foreground">Links Found</div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-lime-green">{result.emails.length}</div>
                    <div className="text-sm text-muted-foreground">Emails Found</div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-primary-green/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-green">
                      {getSecurityScore(result.securityHeaders)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Security Score</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                  <TabsTrigger value="tech">Technology</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass-panel border-primary-green/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4" />
                          Visited Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                        {result.visited.map((url, index) => (
                          <div key={index} className="text-xs font-mono bg-background/50 p-2 rounded">
                            {url}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="glass-panel border-primary-green/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          Forms Detected
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                        {result.forms.map((form, index) => (
                          <div key={index} className="text-xs bg-background/50 p-2 rounded">
                            <div className="font-semibold">{form.action}</div>
                            <div className="text-muted-foreground">Method: {form.method}</div>
                            <div className="text-muted-foreground">Fields: {form.fields.join(", ")}</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="links" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        External Links ({result.links.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                      {result.links.map((link, index) => (
                        <div
                          key={index}
                          className="text-xs font-mono bg-background/50 p-2 rounded hover:bg-background/70 transition-colors"
                        >
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-vibrant-green"
                          >
                            {link}
                          </a>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emails" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Addresses ({result.emails.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.emails.map((email, index) => (
                          <div key={index} className="text-sm font-mono bg-background/50 p-2 rounded">
                            {email}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tech" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass-panel border-primary-green/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Technologies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {result.technologies.map((tech, index) => (
                            <Badge key={index} variant="outline" className="border-primary-green/20">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-panel border-primary-green/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Scripts ({result.scripts.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                        {result.scripts.map((script, index) => (
                          <div key={index} className="text-xs font-mono bg-background/50 p-2 rounded">
                            {script}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card className="glass-panel border-primary-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security Headers Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(result.securityHeaders).map(([header, value]) => (
                        <div key={header} className="flex items-center justify-between p-3 bg-background/50 rounded">
                          <span className="font-medium">{header}</span>
                          <Badge
                            variant={value === "Missing" ? "destructive" : "default"}
                            className={
                              value === "Missing"
                                ? "bg-critical/20 text-critical"
                                : "bg-primary-green/20 text-primary-green"
                            }
                          >
                            {value}
                          </Badge>
                        </div>
                      ))}
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
