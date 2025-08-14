"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Lightbulb, Shield, AlertTriangle } from "lucide-react"

interface AIAssistantProps {
  isScanning: boolean
}

interface AIMessage {
  id: string
  type: "suggestion" | "analysis" | "warning"
  title: string
  content: string
  timestamp: string
  severity?: "critical" | "high" | "medium" | "low"
}

const aiSuggestions: AIMessage[] = [
  {
    id: "1",
    type: "warning",
    title: "SQL Injection Detected",
    content:
      "I found a SQL injection vulnerability in the login form. Consider using parameterized queries and input validation to prevent this attack vector.",
    timestamp: "2 min ago",
    severity: "critical",
  },
  {
    id: "2",
    type: "suggestion",
    title: "Security Headers Missing",
    content:
      "Your application is missing important security headers like X-Frame-Options and Content-Security-Policy. These help prevent clickjacking and XSS attacks.",
    timestamp: "3 min ago",
    severity: "medium",
  },
  {
    id: "3",
    type: "analysis",
    title: "SSL Configuration Review",
    content:
      "Your SSL configuration is mostly secure, but I recommend disabling older TLS versions (1.0, 1.1) and weak cipher suites for better security.",
    timestamp: "5 min ago",
    severity: "low",
  },
]

export function AIAssistant({ isScanning }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isScanning) {
      setMessages([])
      return
    }

    let messageIndex = 0
    const addMessage = () => {
      if (messageIndex >= aiSuggestions.length) return

      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev) => [...prev, aiSuggestions[messageIndex]])
        setIsTyping(false)
        messageIndex++
      }, 1500)
    }

    // Start adding messages after a delay
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        addMessage()
      }, 4000)

      addMessage() // Add first message immediately

      return () => clearInterval(interval)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [isScanning])

  const getMessageIcon = (type: AIMessage["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "suggestion":
        return <Lightbulb className="h-4 w-4 text-yellow-400" />
      case "analysis":
        return <Shield className="h-4 w-4 text-primary-green" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/20 bg-red-500/10 text-red-400"
      case "high":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400"
      case "medium":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
      case "low":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400"
      default:
        return "border-primary-green/20 bg-primary-green/10 text-primary-green"
    }
  }

  return (
    <Card className="glass-panel p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
              <Bot className="h-4 w-4 text-primary-green" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-green">AI Security Assistant</h3>
              <p className="text-xs text-foreground/60">Real-time analysis & suggestions</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary-green/20 text-primary-green">
            Online
          </Badge>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-4">
            {messages.length === 0 && !isScanning && (
              <div className="text-center py-8 text-foreground/60">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">AI assistant is ready to help.</p>
                <p className="text-xs">Start a scan to receive real-time suggestions.</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="animate-in slide-in-from-bottom duration-500">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 border border-primary-green/10">
                  <div className="shrink-0 mt-1">{getMessageIcon(message.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{message.title}</h4>
                      {message.severity && (
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(message.severity)}`}>
                          {message.severity}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{message.content}</p>
                    <p className="text-xs text-foreground/40">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 border border-primary-green/10 animate-pulse">
                <Bot className="h-4 w-4 text-primary-green mt-1" />
                <div className="flex-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-200"></div>
                  </div>
                  <p className="text-xs text-foreground/60 mt-2">AI is analyzing...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
