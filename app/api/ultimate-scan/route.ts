import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface ScanJob {
  id: string
  target: string
  status: "queued" | "crawling" | "scanning" | "confirming" | "completed" | "failed"
  progress: number
  findings: Finding[]
  summary: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
  startedAt: Date
  completedAt?: Date
}

interface Finding {
  id: string
  severity: "Critical" | "High" | "Medium" | "Low"
  type: string
  endpoint: string
  method: string
  param?: string
  payload?: any
  confidence: "Confirmed" | "Likely" | "Needs Review"
  toolSources: string[]
  evidence: {
    request?: string
    response?: string
    screenshot?: string
    domProof?: string
  }
  remediation: string
  cvss?: number
  cwe?: string
}

// In-memory storage for demo (use Redis/DB in production)
const scanJobs = new Map<string, ScanJob>()

export async function POST(request: NextRequest) {
  try {
    const { target, scope } = await request.json()

    if (!target) {
      return NextResponse.json({ error: "Target URL is required" }, { status: 400 })
    }

    const jobId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const job: ScanJob = {
      id: jobId,
      target,
      status: "queued",
      progress: 0,
      findings: [],
      summary: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
      startedAt: new Date(),
    }

    scanJobs.set(jobId, job)

    // Start the scanning process
    performUltimateScan(jobId, target, scope)

    return NextResponse.json({ jobId, status: "queued" })
  } catch (error) {
    console.error("Ultimate scan error:", error)
    return NextResponse.json({ error: "Scan failed to start" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get("jobId")

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
  }

  const job = scanJobs.get(jobId)
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  return NextResponse.json(job)
}

async function performUltimateScan(jobId: string, target: string, scope: any) {
  const job = scanJobs.get(jobId)!

  try {
    job.status = "crawling"
    job.progress = 10

    // Phase 1: Web Crawling & Discovery
    await simulateCrawling(job, target)

    job.status = "scanning"
    job.progress = 30

    // Phase 2: Vulnerability Scanning (OWASP Top 10)
    await performVulnerabilityScanning(job, target)

    job.status = "confirming"
    job.progress = 70

    // Phase 3: Confirmation & Evidence Collection
    await confirmFindings(job)

    job.status = "completed"
    job.progress = 100
    job.completedAt = new Date()

    // Update summary
    updateSummary(job)
  } catch (error) {
    console.error("Scan error:", error)
    job.status = "failed"
  }
}

async function simulateCrawling(job: ScanJob, target: string) {
  // Simulate crawling with realistic delays
  const crawlSteps = [
    "Analyzing robots.txt",
    "Discovering sitemap.xml",
    "Crawling main pages",
    "Extracting forms and endpoints",
    "Identifying JavaScript endpoints",
  ]

  for (let i = 0; i < crawlSteps.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    job.progress = 10 + (i + 1) * 4
  }
}

async function performVulnerabilityScanning(job: ScanJob, target: string) {
  const vulnerabilityChecks = [
    { type: "SQL Injection", severity: "Critical" as const, endpoint: "/login", method: "POST", param: "username" },
    { type: "Cross-Site Scripting (XSS)", severity: "High" as const, endpoint: "/search", method: "GET", param: "q" },
    {
      type: "Cross-Site Request Forgery (CSRF)",
      severity: "Medium" as const,
      endpoint: "/profile/update",
      method: "POST",
    },
    { type: "Insecure Direct Object Reference", severity: "High" as const, endpoint: "/api/user/123", method: "GET" },
    { type: "Security Misconfiguration", severity: "Medium" as const, endpoint: "/.env", method: "GET" },
    { type: "Missing Security Headers", severity: "Low" as const, endpoint: "/", method: "GET" },
    { type: "Directory Traversal", severity: "High" as const, endpoint: "/files", method: "GET", param: "path" },
    { type: "Command Injection", severity: "Critical" as const, endpoint: "/api/ping", method: "POST", param: "host" },
  ]

  for (let i = 0; i < vulnerabilityChecks.length; i++) {
    const vuln = vulnerabilityChecks[i]

    // Simulate realistic vulnerability detection
    if (Math.random() > 0.3) {
      // 70% chance of finding vulnerability
      const finding: Finding = {
        id: `finding_${Date.now()}_${i}`,
        severity: vuln.severity,
        type: vuln.type,
        endpoint: `${target}${vuln.endpoint}`,
        method: vuln.method,
        param: vuln.param,
        confidence: "Likely",
        toolSources: ["ZAP", "Nuclei", "Custom"],
        evidence: {
          request: `${vuln.method} ${vuln.endpoint}${vuln.param ? `?${vuln.param}=payload` : ""}`,
          response: "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html>Vulnerable response...</html>",
        },
        remediation: getRemediation(vuln.type),
        cvss: getCVSSScore(vuln.severity),
        cwe: getCWE(vuln.type),
      }

      job.findings.push(finding)
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    job.progress = 30 + (i + 1) * 5
  }
}

async function confirmFindings(job: ScanJob) {
  // Simulate confirmation process with AI assistance
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  for (let i = 0; i < job.findings.length; i++) {
    const finding = job.findings[i]

    try {
      // Use AI to analyze and confirm findings
      const prompt = `Analyze this security finding and provide confirmation:
      Type: ${finding.type}
      Endpoint: ${finding.endpoint}
      Evidence: ${finding.evidence.request}
      
      Is this a confirmed vulnerability? Provide confidence level and additional evidence.`

      const result = await model.generateContent(prompt)
      const analysis = result.response.text()

      // Update confidence based on AI analysis
      if (analysis.toLowerCase().includes("confirmed") || analysis.toLowerCase().includes("high confidence")) {
        finding.confidence = "Confirmed"
        finding.evidence.domProof = "AI-confirmed vulnerability pattern detected"
      } else if (analysis.toLowerCase().includes("likely") || analysis.toLowerCase().includes("probable")) {
        finding.confidence = "Likely"
      } else {
        finding.confidence = "Needs Review"
      }
    } catch (error) {
      console.error("AI confirmation error:", error)
      finding.confidence = "Needs Review"
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    job.progress = 70 + (i + 1) * (25 / job.findings.length)
  }
}

function updateSummary(job: ScanJob) {
  const summary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 }

  job.findings.forEach((finding) => {
    switch (finding.severity) {
      case "Critical":
        summary.critical++
        break
      case "High":
        summary.high++
        break
      case "Medium":
        summary.medium++
        break
      case "Low":
        summary.low++
        break
    }
    summary.total++
  })

  job.summary = summary
}

function getRemediation(type: string): string {
  const remediations: Record<string, string> = {
    "SQL Injection": "Use parameterized queries, input validation, and least privilege database access.",
    "Cross-Site Scripting (XSS)": "Implement output encoding, Content Security Policy, and input sanitization.",
    "Cross-Site Request Forgery (CSRF)": "Use anti-CSRF tokens, SameSite cookies, and verify referrer headers.",
    "Insecure Direct Object Reference": "Implement proper authorization checks and access controls.",
    "Security Misconfiguration": "Review server configuration, remove default accounts, and apply security patches.",
    "Missing Security Headers":
      "Implement security headers like HSTS, CSP, X-Frame-Options, and X-Content-Type-Options.",
    "Directory Traversal": "Validate and sanitize file paths, use whitelisting for allowed files.",
    "Command Injection": "Avoid system calls with user input, use parameterized commands, and input validation.",
  }

  return remediations[type] || "Review and implement appropriate security controls."
}

function getCVSSScore(severity: string): number {
  const scores: Record<string, number> = {
    Critical: 9.5,
    High: 7.8,
    Medium: 5.2,
    Low: 2.1,
  }
  return scores[severity] || 0
}

function getCWE(type: string): string {
  const cwes: Record<string, string> = {
    "SQL Injection": "CWE-89",
    "Cross-Site Scripting (XSS)": "CWE-79",
    "Cross-Site Request Forgery (CSRF)": "CWE-352",
    "Insecure Direct Object Reference": "CWE-639",
    "Security Misconfiguration": "CWE-16",
    "Missing Security Headers": "CWE-693",
    "Directory Traversal": "CWE-22",
    "Command Injection": "CWE-78",
  }
  return cwes[type] || "CWE-Unknown"
}
