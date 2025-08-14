import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get("domain")

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 })
  }

  try {
    // Simulate WHOIS lookup with realistic data
    const mockWhoisData = {
      domainName: domain.toLowerCase(),
      registrar: "GoDaddy.com, LLC",
      creationDate: "2020-03-15T10:30:00Z",
      expirationDate: "2025-03-15T10:30:00Z",
      updatedDate: "2024-01-20T14:22:00Z",
      nameServers: ["ns1.example.com", "ns2.example.com"],
      status: ["clientTransferProhibited", "clientUpdateProhibited"],
      emails: ["admin@" + domain, "tech@" + domain],
      registrantCountry: "US",
      registrantOrganization: "Private Registration",
      adminContact: "Privacy Protected",
      techContact: "Privacy Protected",
      dnssec: "unsigned",
    }

    // Add some variation based on domain
    if (domain.includes("google")) {
      mockWhoisData.registrar = "MarkMonitor Inc."
      mockWhoisData.registrantOrganization = "Google LLC"
      mockWhoisData.dnssec = "signedDelegation"
    } else if (domain.includes("github")) {
      mockWhoisData.registrar = "CSC Corporate Domains, Inc."
      mockWhoisData.registrantOrganization = "GitHub, Inc."
    }

    return NextResponse.json(mockWhoisData)
  } catch (error) {
    return NextResponse.json({ error: "WHOIS lookup failed", details: error }, { status: 500 })
  }
}
