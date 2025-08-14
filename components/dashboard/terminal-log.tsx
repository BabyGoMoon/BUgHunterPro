"use client"
import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TerminalLogProps {
  isScanning: boolean
  targetUrl: string
}

interface LogEntry {
  id: string
  timestamp: string
  type: "info" | "success" | "warning" | "error"
  message: string
}

const mockLogMessages = [
  { type: "info", message: "Initializing scan engine..." },
  { type: "info", message: "Loading vulnerability database..." },
  { type: "success", message: "Target reachable: {url}" },
  { type: "info", message: "Starting port scan on {url}..." },
  { type: "success", message: "Found open port: 80/tcp (HTTP)" },
  { type: "success", message: "Found open port: 443/tcp (HTTPS)" },
  { type: "warning", message: "Port 22/tcp (SSH) detected - checking for weak credentials" },
  { type: "info", message: "Analyzing HTTP headers..." },
  { type: "warning", message: "Missing security header: X-Frame-Options" },
  { type: "error", message: "SQL injection vulnerability detected in /login.php" },
  { type: "error", message: "XSS vulnerability found in search parameter" },
  { type: "success", message: "SSL/TLS configuration analysis complete" },
  { type: "warning", message: "Weak cipher suite detected: TLS_RSA_WITH_AES_128_CBC_SHA" },
  { type: "info", message: "Checking for common vulnerabilities..." },
  { type: "error", message: "Directory traversal vulnerability in /files/" },
  { type: "success", message: "Scan completed successfully" },
]

export function TerminalLog({ isScanning, targetUrl }: TerminalLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const logIndexRef = useRef(0)

  useEffect(() => {
    if (!isScanning) {
      setLogs([])
      logIndexRef.current = 0
      return
    }

    const addLogEntry = () => {
      if (logIndexRef.current >= mockLogMessages.length) return

      const logTemplate = mockLogMessages[logIndexRef.current]
      const newLog: LogEntry = {
        id: `log-${Date.now()}-${logIndexRef.current}`,
        timestamp: new Date().toLocaleTimeString(),
        type: logTemplate.type as LogEntry["type"],
        message: logTemplate.message.replace("{url}", targetUrl),
      }

      setLogs((prev) => [...prev, newLog])
      logIndexRef.current++

      // Auto-scroll to bottom
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          }
        }
      }, 100)
    }

    // Add initial log entry immediately
    addLogEntry()

    // Continue adding entries at intervals
    const interval = setInterval(() => {
      addLogEntry()
    }, 1500)

    return () => clearInterval(interval)
  }, [isScanning, targetUrl])

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-primary-green"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-400"
      default:
        return "text-foreground/80"
    }
  }

  const getLogPrefix = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "[✓]"
      case "warning":
        return "[!]"
      case "error":
        return "[✗]"
      default:
        return "[i]"
    }
  }

  return (
    <div className="bg-black/50 rounded-lg border border-primary-green/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-primary-green/10 border-b border-primary-green/20">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-primary-green rounded-full"></div>
          </div>
          <span className="text-sm font-mono text-foreground/80">scan-terminal</span>
        </div>
        <div className="text-xs text-foreground/60 font-mono">{logs.length} entries</div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-80">
        <div className="p-4 space-y-1 font-mono text-sm">
          {logs.length === 0 && !isScanning && (
            <div className="text-foreground/40 italic">Terminal ready. Start a scan to see live output...</div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 animate-in slide-in-from-left duration-300">
              <span className="text-foreground/40 text-xs shrink-0 w-20">{log.timestamp}</span>
              <span className={`shrink-0 ${getLogColor(log.type)}`}>{getLogPrefix(log.type)}</span>
              <span className={`${getLogColor(log.type)} break-all`}>{log.message}</span>
            </div>
          ))}
          {isScanning && (
            <div className="flex items-center space-x-2 text-primary-green animate-pulse">
              <span className="text-foreground/40 text-xs w-20">{new Date().toLocaleTimeString()}</span>
              <span>▋</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
