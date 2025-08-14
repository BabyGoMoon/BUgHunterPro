import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { targetUrl } = await request.json()

  if (!targetUrl) {
    return new Response("No URL provided", { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const sendUpdate = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Simulate real-time scanning progress
      const scanSteps = [
        { progress: 5, message: "Initializing scan...", phase: "initialization" },
        { progress: 15, message: "Checking connectivity...", phase: "connectivity" },
        { progress: 25, message: "Analyzing security headers...", phase: "headers" },
        { progress: 40, message: "Scanning for XSS vulnerabilities...", phase: "xss" },
        { progress: 55, message: "Checking for SQL injection...", phase: "sqli" },
        { progress: 70, message: "Analyzing SSL/TLS configuration...", phase: "ssl" },
        { progress: 85, message: "Performing final security checks...", phase: "final" },
        { progress: 100, message: "Scan completed", phase: "completed" },
      ]

      let stepIndex = 0
      const interval = setInterval(() => {
        if (stepIndex < scanSteps.length) {
          sendUpdate(scanSteps[stepIndex])
          stepIndex++
        } else {
          // Send final results
          sendUpdate({
            progress: 100,
            completed: true,
            findings: [
              {
                id: "missing-csp",
                type: "Missing Security Header",
                severity: "high",
                description: "Content-Security-Policy header is missing",
                cvss: 7.5,
              },
            ],
          })
          controller.close()
          clearInterval(interval)
        }
      }, 1000)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
