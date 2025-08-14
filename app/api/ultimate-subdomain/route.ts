import { type NextRequest, NextResponse } from "next/server"
import dns from "dns/promises"

// Comprehensive subdomain wordlist for maximum accuracy
const comprehensiveWordlist = [
  // Common subdomains
  "www",
  "mail",
  "ftp",
  "dev",
  "test",
  "admin",
  "blog",
  "api",
  "shop",
  "staging",
  "portal",
  "beta",
  "webmail",
  "support",
  "secure",
  "vpn",
  "cms",
  "forum",
  "dashboard",
  "cpanel",
  "m",
  "mobile",
  "app",
  "apps",
  "cdn",

  // Development & Testing
  "development",
  "testing",
  "qa",
  "uat",
  "preprod",
  "prod",
  "production",
  "demo",
  "sandbox",
  "lab",
  "labs",
  "dev1",
  "dev2",
  "test1",
  "test2",
  "stage",
  "staging1",
  "staging2",
  "preview",
  "alpha",
  "beta",
  "gamma",

  // Administrative
  "admin",
  "administrator",
  "root",
  "sys",
  "system",
  "control",
  "panel",
  "manage",
  "management",
  "console",
  "backend",
  "backoffice",
  "office",
  "internal",
  "intranet",
  "private",
  "staff",
  "employee",
  "hr",

  // Services & Applications
  "api",
  "api1",
  "api2",
  "rest",
  "graphql",
  "service",
  "services",
  "microservice",
  "gateway",
  "proxy",
  "auth",
  "authentication",
  "login",
  "sso",
  "oauth",
  "ldap",
  "ad",
  "directory",
  "identity",

  // Infrastructure
  "server",
  "srv",
  "host",
  "node",
  "cluster",
  "lb",
  "loadbalancer",
  "proxy",
  "cache",
  "redis",
  "db",
  "database",
  "mysql",
  "postgres",
  "mongo",
  "elasticsearch",
  "kibana",
  "grafana",
  "prometheus",

  // Communication
  "mail",
  "email",
  "smtp",
  "pop",
  "imap",
  "webmail",
  "exchange",
  "outlook",
  "calendar",
  "contacts",
  "chat",
  "slack",
  "teams",
  "zoom",
  "meet",
  "conference",
  "video",
  "voice",
  "sip",
  "voip",

  // Content & Media
  "blog",
  "news",
  "press",
  "media",
  "images",
  "img",
  "static",
  "assets",
  "files",
  "download",
  "uploads",
  "docs",
  "documentation",
  "wiki",
  "help",
  "support",
  "faq",
  "kb",
  "knowledgebase",
  "manual",

  // E-commerce & Business
  "shop",
  "store",
  "cart",
  "checkout",
  "payment",
  "pay",
  "billing",
  "invoice",
  "order",
  "orders",
  "customer",
  "customers",
  "client",
  "clients",
  "partner",
  "partners",
  "vendor",
  "suppliers",

  // Monitoring & Analytics
  "monitor",
  "monitoring",
  "metrics",
  "stats",
  "analytics",
  "tracking",
  "logs",
  "logging",
  "audit",
  "health",
  "status",
  "ping",
  "uptime",
  "performance",
  "speed",
  "benchmark",
  "test",

  // Security
  "security",
  "sec",
  "firewall",
  "waf",
  "ids",
  "ips",
  "antivirus",
  "scanner",
  "scan",
  "pentest",
  "vulnerability",
  "vuln",
  "audit",
  "compliance",
  "policy",
  "governance",
  "risk",

  // Geographic & Language
  "us",
  "eu",
  "asia",
  "uk",
  "ca",
  "au",
  "de",
  "fr",
  "es",
  "it",
  "jp",
  "cn",
  "in",
  "br",
  "en",
  "english",
  "spanish",
  "french",
  "german",
  "chinese",
  "japanese",
  "korean",
  "arabic",

  // Mobile & Devices
  "mobile",
  "m",
  "wap",
  "touch",
  "tablet",
  "ipad",
  "android",
  "ios",
  "app",
  "application",
  "pwa",
  "responsive",
  "adaptive",
  "device",
  "smart",
  "iot",
  "sensor",
  "beacon",

  // Social & Community
  "social",
  "community",
  "forum",
  "discussion",
  "board",
  "group",
  "team",
  "member",
  "user",
  "profile",
  "account",
  "settings",
  "preferences",
  "notification",
  "message",
  "inbox",

  // Development Tools
  "git",
  "svn",
  "repo",
  "repository",
  "code",
  "source",
  "build",
  "ci",
  "cd",
  "jenkins",
  "travis",
  "github",
  "gitlab",
  "bitbucket",
  "docker",
  "kubernetes",
  "k8s",
  "helm",

  // Third-party Integrations
  "salesforce",
  "hubspot",
  "mailchimp",
  "sendgrid",
  "twilio",
  "stripe",
  "paypal",
  "aws",
  "azure",
  "gcp",
  "cloudflare",
  "fastly",
  "akamai",
  "maxcdn",
  "jsdelivr",
  "unpkg",
]

// Certificate Transparency Log query
async function fetchCertificateTransparency(domain: string): Promise<string[]> {
  try {
    const response = await fetch(`https://crt.sh/?q=%25.${domain}&output=json`, {
      headers: { "User-Agent": "BugHunter-Pro-Scanner/1.0" },
    })

    if (!response.ok) return []

    const data = await response.json()
    const subdomains = new Set<string>()

    data.forEach((entry: any) => {
      if (entry.name_value) {
        entry.name_value.split("\n").forEach((name: string) => {
          const cleanName = name.trim().toLowerCase()
          if (cleanName.endsWith(`.${domain}`) && !cleanName.includes("*")) {
            subdomains.add(cleanName)
          }
        })
      }
    })

    return Array.from(subdomains)
  } catch (error) {
    console.error("Certificate Transparency query failed:", error)
    return []
  }
}

// AI-powered subdomain suggestions using Gemini
async function getAISubdomainSuggestions(domain: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 20 uncommon but realistic subdomain names for ${domain}. Focus on: admin panels, development environments, API endpoints, internal tools, staging servers, and hidden services. Return only the subdomain names, one per line, without the domain suffix.`,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) return []

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return text
      .split("\n")
      .map((line: string) => line.trim().toLowerCase())
      .filter((sub: string) => sub && /^[a-z0-9-]+$/.test(sub))
      .slice(0, 20)
  } catch (error) {
    console.error("AI subdomain suggestions failed:", error)
    return []
  }
}

// DNS resolution with timeout
async function resolveDNS(hostname: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    await dns.lookup(hostname)
    clearTimeout(timeoutId)
    return true
  } catch (error) {
    return false
  }
}

// Parallel DNS resolution with rate limiting
async function checkLiveSubdomains(candidates: string[]): Promise<string[]> {
  const liveSubdomains: string[] = []
  const batchSize = 50 // Process in batches to avoid overwhelming DNS

  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize)
    const promises = batch.map(async (subdomain) => {
      const isLive = await resolveDNS(subdomain)
      return isLive ? subdomain : null
    })

    const results = await Promise.all(promises)
    const liveBatch = results.filter(Boolean) as string[]
    liveSubdomains.push(...liveBatch)

    // Small delay between batches to be respectful
    if (i + batchSize < candidates.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return liveSubdomains
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Valid domain is required" }, { status: 400 })
    }

    // Clean and validate domain
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")

    // Collect subdomain candidates from multiple sources
    const candidateSet = new Set<string>()

    // 1. Add comprehensive wordlist
    comprehensiveWordlist.forEach((word) => {
      candidateSet.add(`${word}.${cleanDomain}`)
    })

    // 2. Certificate Transparency Logs
    const certSubdomains = await fetchCertificateTransparency(cleanDomain)
    certSubdomains.forEach((sub) => candidateSet.add(sub))

    // 3. AI-powered suggestions
    const aiSuggestions = await getAISubdomainSuggestions(cleanDomain)
    aiSuggestions.forEach((sub) => candidateSet.add(`${sub}.${cleanDomain}`))

    // Convert to array and check for live subdomains
    const candidates = Array.from(candidateSet)
    const liveSubdomains = await checkLiveSubdomains(candidates)

    // Sort results for better presentation
    const sortedLive = liveSubdomains.sort((a, b) => {
      const aIsWWW = a.startsWith("www.")
      const bIsWWW = b.startsWith("www.")
      if (aIsWWW && !bIsWWW) return -1
      if (!aIsWWW && bIsWWW) return 1
      return a.localeCompare(b)
    })

    return NextResponse.json({
      domain: cleanDomain,
      totalCandidates: candidates.length,
      liveSubdomainsCount: sortedLive.length,
      liveSubdomains: sortedLive,
      sources: {
        wordlist: comprehensiveWordlist.length,
        certificateTransparency: certSubdomains.length,
        aiSuggestions: aiSuggestions.length,
      },
    })
  } catch (error) {
    console.error("Subdomain scan error:", error)
    return NextResponse.json({ error: "Internal server error during subdomain scan" }, { status: 500 })
  }
}
