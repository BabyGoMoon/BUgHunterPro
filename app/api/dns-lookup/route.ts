import { type NextRequest, NextResponse } from "next/server"
import dns from "dns/promises"

interface DNSRecordResult {
  type: string
  records: string[]
  notes?: string[]
  resolver?: string
}

const resolvers = [
  { name: "Google", ip: "8.8.8.8" },
  { name: "Cloudflare", ip: "1.1.1.1" },
  { name: "Quad9", ip: "9.9.9.9" },
  { name: "OpenDNS", ip: "208.67.222.222" },
]

async function lookupWithResolver(domain: string, type: string, resolverIp: string): Promise<string[]> {
  try {
    const resolver = new dns.Resolver()
    resolver.setServers([resolverIp])

    let records: any[] = []

    switch (type) {
      case "A":
        records = await resolver.resolve4(domain)
        break
      case "AAAA":
        records = await resolver.resolve6(domain)
        break
      case "CNAME":
        records = await resolver.resolveCname(domain)
        break
      case "MX":
        records = await resolver.resolveMx(domain)
        break
      case "TXT":
        records = await resolver.resolveTxt(domain)
        break
      case "NS":
        records = await resolver.resolveNs(domain)
        break
      case "SOA":
        const soa = await resolver.resolveSoa(domain)
        records = [soa]
        break
      case "PTR":
        records = await resolver.reverse(domain)
        break
      case "SRV":
        records = await resolver.resolveSrv(domain)
        break
      default:
        return []
    }

    return records.map((record) => (typeof record === "object" ? JSON.stringify(record) : String(record)))
  } catch (error) {
    return []
  }
}

async function comprehensiveDNSLookup(domain: string): Promise<DNSRecordResult[]> {
  const recordTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "SRV"]
  const results: DNSRecordResult[] = []

  for (const type of recordTypes) {
    const resolverResults: { [key: string]: string[] } = {}

    // Query all resolvers for cross-validation
    for (const resolver of resolvers) {
      const records = await lookupWithResolver(domain, type, resolver.ip)
      if (records.length > 0) {
        resolverResults[resolver.name] = records
      }
    }

    // Combine and validate results
    const allRecords = Object.values(resolverResults).flat()
    const uniqueRecords = [...new Set(allRecords)]
    const notes: string[] = []

    // Check for inconsistencies between resolvers
    const resolverNames = Object.keys(resolverResults)
    if (resolverNames.length > 1) {
      const firstResult = resolverResults[resolverNames[0]]
      const hasInconsistency = resolverNames.some(
        (name) => JSON.stringify(resolverResults[name].sort()) !== JSON.stringify(firstResult.sort()),
      )

      if (hasInconsistency) {
        notes.push("DNS propagation inconsistency detected across resolvers")
      }
    }

    if (uniqueRecords.length === 0 && type === "A") {
      notes.push("No A records found - domain may not be properly configured")
    }

    results.push({
      type,
      records: uniqueRecords,
      notes: notes.length > 0 ? notes : undefined,
    })
  }

  return results
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const dnsResults = await comprehensiveDNSLookup(domain)

    // Additional security checks
    const securityNotes: string[] = []
    const txtRecords = dnsResults.find((r) => r.type === "TXT")?.records || []

    // Check for SPF, DKIM, DMARC
    const hasSpf = txtRecords.some((record) => record.includes("v=spf1"))
    const hasDmarc = txtRecords.some((record) => record.includes("v=DMARC1"))

    if (!hasSpf) securityNotes.push("Missing SPF record - email spoofing risk")
    if (!hasDmarc) securityNotes.push("Missing DMARC record - email security risk")

    return NextResponse.json({
      domain,
      dnsResults,
      securityNotes,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("DNS lookup error:", error)
    return NextResponse.json({ error: "DNS lookup failed" }, { status: 500 })
  }
}
