import { type NextRequest, NextResponse } from "next/server"

interface VulnerabilityExplanation {
  summary: string
  technicalDetails: string
  businessImpact: string
  remediation: string
  priority: string
}

// Simulate AI-powered vulnerability explanation
function generateAIExplanation(findings: any[]): VulnerabilityExplanation {
  const criticalCount = findings.filter((f) => f.severity === "critical").length
  const highCount = findings.filter((f) => f.severity === "high").length
  const mediumCount = findings.filter((f) => f.severity === "medium").length
  const lowCount = findings.filter((f) => f.severity === "low").length

  let summary = ""
  let priority = "Low"
  let businessImpact = ""

  if (criticalCount > 0) {
    summary = `🚨 Critical security issues detected! Your application has ${criticalCount} critical vulnerabilities that require immediate attention.`
    priority = "Critical"
    businessImpact = "High risk of data breach, system compromise, or service disruption. Immediate action required."
  } else if (highCount > 0) {
    summary = `⚠️ High-risk vulnerabilities found. ${highCount} high-severity issues need prompt resolution.`
    priority = "High"
    businessImpact = "Moderate to high risk of security incidents. Should be addressed within 24-48 hours."
  } else if (mediumCount > 0) {
    summary = `📋 Medium-risk security gaps identified. ${mediumCount} issues should be addressed to improve security posture.`
    priority = "Medium"
    businessImpact = "Low to moderate risk. Address within the next sprint or security maintenance window."
  } else if (lowCount > 0) {
    summary = `✅ Minor security improvements recommended. ${lowCount} low-priority items for security hardening.`
    priority = "Low"
    businessImpact = "Minimal immediate risk. Address during regular maintenance cycles."
  } else {
    summary = "🎉 Great job! No significant vulnerabilities detected in this scan."
    priority = "None"
    businessImpact = "No immediate security concerns identified."
  }

  const technicalDetails = findings.map((f) => `• ${f.type} (${f.severity.toUpperCase()}): ${f.description}`).join("\n")

  const remediation =
    findings.length > 0
      ? `Priority actions:\n${findings
          .sort((a, b) => {
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
            return severityOrder[b.severity] - severityOrder[a.severity]
          })
          .slice(0, 3)
          .map((f, i) => `${i + 1}. ${f.recommendation}`)
          .join("\n")}`
      : "Continue following security best practices and perform regular scans."

  return {
    summary,
    technicalDetails,
    businessImpact,
    remediation,
    priority,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { findings } = await request.json()

    if (!findings || !Array.isArray(findings)) {
      return NextResponse.json({ error: "Invalid findings data" }, { status: 400 })
    }

    const explanation = generateAIExplanation(findings)

    return NextResponse.json({
      explanation,
      generatedAt: new Date().toISOString(),
      model: "BugHunter-AI-Assistant",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate explanation", details: error.message }, { status: 500 })
  }
}
