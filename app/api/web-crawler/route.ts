import { type NextRequest, NextResponse } from "next/server"

interface CrawlResult {
  url: string
  status: number
  title?: string
  links: string[]
  forms: {
    method: string
    action: string
    inputs: { name: string; type: string; required: boolean }[]
    hasCSRF: boolean
  }[]
  endpoints: string[]
  technologies: string[]
  securityHeaders: { [key: string]: string | null }
  notes: string[]
}

const MAX_DEPTH = 2
const MAX_PAGES = 20
const REQUEST_DELAY = 1000 // 1 second between requests

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Simple HTML parser without JSDOM
function parseHTML(html: string, baseUrl: string) {
  const result = {
    title: "",
    links: [] as string[],
    forms: [] as any[],
    endpoints: [] as string[],
    technologies: [] as string[],
  }

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  result.title = titleMatch ? titleMatch[1].trim() : "No title"

  // Extract links
  const linkMatches = html.matchAll(/<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi)
  for (const match of linkMatches) {
    try {
      const href = match[1]
      const linkUrl = new URL(href, baseUrl)
      if (linkUrl.protocol === "http:" || linkUrl.protocol === "https:") {
        result.links.push(linkUrl.href)
      }
    } catch {
      // Invalid URL, skip
    }
  }

  // Extract forms
  const formMatches = html.matchAll(/<form[^>]*>(.*?)<\/form>/gis)
  for (const formMatch of formMatches) {
    const formHtml = formMatch[0]
    const methodMatch = formHtml.match(/method\s*=\s*["']([^"']+)["']/i)
    const actionMatch = formHtml.match(/action\s*=\s*["']([^"']+)["']/i)

    const method = methodMatch ? methodMatch[1].toUpperCase() : "GET"
    const action = actionMatch ? actionMatch[1] : baseUrl

    // Extract inputs
    const inputMatches = formHtml.matchAll(/<(?:input|textarea|select)[^>]*>/gi)
    const inputs = []
    for (const inputMatch of inputMatches) {
      const inputHtml = inputMatch[0]
      const nameMatch = inputHtml.match(/name\s*=\s*["']([^"']+)["']/i)
      const typeMatch = inputHtml.match(/type\s*=\s*["']([^"']+)["']/i)
      const required = inputHtml.includes("required")

      inputs.push({
        name: nameMatch ? nameMatch[1] : "",
        type: typeMatch ? typeMatch[1] : "text",
        required,
      })
    }

    // Check for CSRF protection
    const hasCSRF =
      inputs.some((input) => input.name.toLowerCase().includes("csrf") || input.name.toLowerCase().includes("token")) ||
      html.toLowerCase().includes("csrf") ||
      html.toLowerCase().includes("_token")

    result.forms.push({ method, action, inputs, hasCSRF })
  }

  // Detect technologies
  const techIndicators = [
    { name: "WordPress", pattern: /wp-content|wp-includes|wordpress/i },
    { name: "React", pattern: /react|__REACT_DEVTOOLS/i },
    { name: "Angular", pattern: /angular|ng-/i },
    { name: "Vue.js", pattern: /vue\.js|__VUE__/i },
    { name: "jQuery", pattern: /jquery/i },
    { name: "Bootstrap", pattern: /bootstrap/i },
    { name: "PHP", pattern: /\.php/i },
  ]

  techIndicators.forEach((tech) => {
    if (tech.pattern.test(html)) {
      result.technologies.push(tech.name)
    }
  })

  // Extract potential API endpoints from JavaScript
  const scriptMatches = html.matchAll(/<script[^>]*>(.*?)<\/script>/gis)
  const jsContent = Array.from(scriptMatches)
    .map((match) => match[1])
    .join(" ")

  const apiPatterns = [
    /['"](\/api\/[^'"]+)['"]/g,
    /['"](\/v\d+\/[^'"]+)['"]/g,
    /fetch\s*\(\s*['"]([^'"]+)['"]/g,
    /axios\.[get|post|put|delete]+\s*\(\s*['"]([^'"]+)['"]/g,
  ]

  apiPatterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(jsContent)) !== null) {
      try {
        const endpointUrl = new URL(match[1], baseUrl).href
        result.endpoints.push(endpointUrl)
      } catch {
        // Invalid URL, skip
      }
    }
  })

  // Remove duplicates
  result.links = [...new Set(result.links)]
  result.endpoints = [...new Set(result.endpoints)]

  return result
}

async function analyzePage(url: string): Promise<CrawlResult> {
  const result: CrawlResult = {
    url,
    status: 0,
    links: [],
    forms: [],
    endpoints: [],
    technologies: [],
    securityHeaders: {},
    notes: [],
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BugHunter-Pro-Scanner/1.0",
      },
      redirect: "follow",
    })

    result.status = response.status

    // Analyze security headers
    result.securityHeaders = {
      "X-Frame-Options": response.headers.get("X-Frame-Options"),
      "X-Content-Type-Options": response.headers.get("X-Content-Type-Options"),
      "Strict-Transport-Security": response.headers.get("Strict-Transport-Security"),
      "Content-Security-Policy": response.headers.get("Content-Security-Policy"),
      "X-XSS-Protection": response.headers.get("X-XSS-Protection"),
    }

    // Check for missing security headers
    Object.entries(result.securityHeaders).forEach(([header, value]) => {
      if (!value) {
        result.notes.push(`Missing security header: ${header}`)
      }
    })

    const html = await response.text()

    // Parse HTML using simple regex-based parser
    const parsed = parseHTML(html, url)
    result.title = parsed.title
    result.links = parsed.links
    result.forms = parsed.forms
    result.endpoints = parsed.endpoints
    result.technologies = parsed.technologies

    // Add security notes for forms without CSRF
    result.forms.forEach((form) => {
      if (!form.hasCSRF && form.method === "POST") {
        result.notes.push(`Form without CSRF protection: ${form.action}`)
      }
    })
  } catch (error) {
    result.notes.push(`Crawl error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  return result
}

async function crawlWebsite(startUrl: string, maxDepth: number = MAX_DEPTH): Promise<CrawlResult[]> {
  const visited = new Set<string>()
  const results: CrawlResult[] = []
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }]

  while (queue.length > 0 && results.length < MAX_PAGES) {
    const { url, depth } = queue.shift()!

    if (visited.has(url) || depth > maxDepth) continue
    visited.add(url)

    await delay(REQUEST_DELAY) // Rate limiting

    const result = await analyzePage(url)
    results.push(result)

    // Add new links to queue for next depth level
    if (depth < maxDepth) {
      const baseUrl = new URL(startUrl)
      result.links
        .filter((link) => {
          try {
            const linkUrl = new URL(link)
            return linkUrl.hostname === baseUrl.hostname && !visited.has(link)
          } catch {
            return false
          }
        })
        .slice(0, 5) // Limit links per page to prevent explosion
        .forEach((link) => {
          queue.push({ url: link, depth: depth + 1 })
        })
    }
  }

  return results
}

export async function POST(request: NextRequest) {
  try {
    const { target, maxDepth = 2 } = await request.json()

    if (!target) {
      return NextResponse.json({ error: "Target URL is required" }, { status: 400 })
    }

    // Validate and normalize URL
    let normalizedUrl: string
    try {
      const url = new URL(target.startsWith("http") ? target : `https://${target}`)
      normalizedUrl = url.href
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const crawlResults = await crawlWebsite(normalizedUrl, Math.min(maxDepth, 2))

    // Generate summary statistics
    const summary = {
      totalPages: crawlResults.length,
      totalLinks: crawlResults.reduce((sum, result) => sum + result.links.length, 0),
      totalForms: crawlResults.reduce((sum, result) => sum + result.forms.length, 0),
      totalEndpoints: crawlResults.reduce((sum, result) => sum + result.endpoints.length, 0),
      technologies: [...new Set(crawlResults.flatMap((result) => result.technologies))],
      securityIssues: crawlResults.reduce((sum, result) => sum + result.notes.length, 0),
    }

    return NextResponse.json({
      target: normalizedUrl,
      summary,
      crawlResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Web crawler error:", error)
    return NextResponse.json(
      {
        error: `Crawling failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
