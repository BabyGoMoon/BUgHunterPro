"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Copy,
  Download,
  Code,
  Shield,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "code" | "scan" | "command"
}

export function AITonmoyBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "🛡️ Hi! I'm AI Tonmoy, your ultimate cybersecurity assistant powered by Gemini AI.\n\nI can help you with:\n• Vulnerability analysis & explanations\n• Code generation (Python, JS, Bash)\n• Scan result interpretation\n• Security recommendations\n• Payload generation & testing\n• Real-time guidance\n\nTry commands like:\n/scan example.com\n/generate-payload SQL\n/explain CVE-2023-1234\n\nHow can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [commandMode, setCommandMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectMessageType = (text: string): "text" | "code" | "scan" | "command" => {
    if (text.startsWith("/")) return "command"
    if (text.includes("```") || text.includes("function") || text.includes("import")) return "code"
    if (text.includes("vulnerability") || text.includes("CVE-") || text.includes("exploit")) return "scan"
    return "text"
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const messageType = detectMessageType(inputMessage)
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: messageType,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      // Enhanced prompt for better AI responses
      let enhancedPrompt = currentInput

      if (currentInput.startsWith("/scan")) {
        enhancedPrompt = `As a cybersecurity expert, analyze and explain scan results for: ${currentInput.replace("/scan", "").trim()}. Provide detailed vulnerability assessment, risk levels, and remediation steps.`
      } else if (currentInput.startsWith("/generate-payload")) {
        enhancedPrompt = `Generate safe, educational security testing payload for: ${currentInput.replace("/generate-payload", "").trim()}. Include explanation of how it works and ethical usage guidelines.`
      } else if (currentInput.startsWith("/explain")) {
        enhancedPrompt = `Provide detailed cybersecurity explanation for: ${currentInput.replace("/explain", "").trim()}. Include technical details, impact assessment, and mitigation strategies.`
      } else {
        enhancedPrompt = `As AI Tonmoy, a cybersecurity expert assistant for BugHunter Pro platform, help with: ${currentInput}. Provide detailed, actionable cybersecurity guidance.`
      }

      const response = await fetch("/api/ai-tonmoy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: enhancedPrompt,
          context: "BugHunter Pro - Ultimate Cybersecurity Platform",
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      const data = await response.json()

      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "ai",
          timestamp: new Date(),
          type: detectMessageType(data.response),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error("AI Tonmoy error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🚨 Connection error! I'm having trouble connecting to my AI brain right now. Please try again in a moment. Your cybersecurity questions are important to me!",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadChat = () => {
    const chatContent = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.text}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-tonmoy-chat-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="h-3 w-3" />
      case "scan":
        return <Shield className="h-3 w-3" />
      case "command":
        return <Zap className="h-3 w-3" />
      default:
        return <Bot className="h-3 w-3" />
    }
  }

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 z-[9999]"
        style={{ pointerEvents: "auto" }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-green to-vibrant-green hover:from-vibrant-green hover:to-lime-green text-black shadow-lg hover:shadow-[0_0_30px_rgba(0,255,0,0.6)] transition-all duration-300 border-2 border-primary-green/50 cursor-pointer"
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex flex-col items-center">
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs font-bold">AI</span>
          </div>
        </Button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 right-6 z-[9999]"
        style={{ pointerEvents: "auto" }}
      >
        <Card
          className={`bg-black/95 border-primary-green/40 backdrop-blur-xl transition-all duration-300 shadow-2xl shadow-primary-green/20 ${
            isMinimized ? "w-80 h-16" : "w-[380px] h-[480px]"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-primary-green/30 bg-gradient-to-r from-primary-green/10 to-vibrant-green/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-green/30 to-vibrant-green/30 flex items-center justify-center border border-primary-green/50">
                <Bot className="h-4 w-4 text-primary-green" />
              </div>
              <div>
                <CardTitle className="text-primary-green text-base font-bold">AI Tonmoy</CardTitle>
                <p className="text-xs text-gray-400">Cybersecurity Expert</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-lime-green animate-pulse" />
                <Badge variant="outline" className="text-xs border-primary-green/50 text-primary-green">
                  Online
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadChat}
                className="h-8 w-8 p-0 hover:bg-primary-green/20"
                title="Download Chat"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 hover:bg-primary-green/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-red-500/30"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(480px-64px)]">
              <ScrollArea className="flex-1 p-3 max-h-[320px]">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "ai" && (
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary-green/30 to-vibrant-green/30 flex items-center justify-center flex-shrink-0 mt-1 border border-primary-green/50">
                          {getMessageIcon(message.type || "text")}
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] p-3 rounded-xl text-sm relative group ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white ml-auto border border-blue-500/30"
                            : "bg-gradient-to-r from-gray-800/80 to-gray-900/80 text-gray-100 border border-primary-green/20"
                        }`}
                      >
                        {message.type && message.sender === "ai" && (
                          <Badge
                            variant="outline"
                            className="absolute -top-2 left-2 text-xs border-primary-green/50 text-primary-green bg-black/50"
                          >
                            {message.type}
                          </Badge>
                        )}
                        <p className="whitespace-pre-wrap leading-relaxed text-xs">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-60">{message.timestamp.toLocaleTimeString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.text)}
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1 border border-blue-500/50">
                          <User className="h-3 w-3 text-blue-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary-green/30 to-vibrant-green/30 flex items-center justify-center flex-shrink-0 mt-1 border border-primary-green/50">
                        <Bot className="h-4 w-4 text-primary-green" />
                      </div>
                      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-4 rounded-xl border border-primary-green/20">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-primary-green rounded-full animate-bounce" />
                          <div
                            className="h-2 w-2 bg-primary-green rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="h-2 w-2 bg-primary-green rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">AI Tonmoy is thinking...</p>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 p-3 border-t-2 border-primary-green/50 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm">
                <div className="flex gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className="text-xs border-primary-green/50 text-primary-green bg-black/50 px-2 py-1"
                  >
                    💡 Try: /scan domain.com
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs border-vibrant-green/50 text-vibrant-green bg-black/50 px-2 py-1"
                  >
                    🔍 /generate-payload SQL
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about cybersecurity..."
                    className="flex-1 bg-gray-800/90 border-2 border-primary-green/50 text-gray-100 placeholder:text-gray-400 focus:border-primary-green focus:ring-2 focus:ring-primary-green/30 text-sm h-12 px-4 rounded-lg"
                    disabled={isLoading}
                    autoComplete="off"
                    autoFocus
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-primary-green to-vibrant-green hover:from-vibrant-green hover:to-lime-green text-black font-bold px-6 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,0,0.6)] transition-all duration-300 h-12 rounded-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center font-medium">
                  Press Enter to send • Available commands: /scan /generate-payload /explain
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
