"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Search, Network, Lock, Eye, Zap, Target, Database, FileText, Wifi, Server } from "lucide-react"

const tools = [
  {
    id: "vulnerability-scanner",
    name: "Vulnerability Scanner",
    description: "Comprehensive security assessment with OWASP Top 10 coverage",
    icon: <Shield className="h-8 w-8" />,
    category: "Security Testing",
    features: ["SQL Injection", "XSS Detection", "CSRF Analysis", "Security Headers"],
    href: "/dashboard",
    status: "available",
    difficulty: "Beginner",
  },
  {
    id: "subdomain-finder",
    name: "Subdomain Finder",
    description: "Discover hidden subdomains and expand your attack surface",
    icon: <Globe className="h-8 w-8" />,
    category: "Reconnaissance",
    features: ["DNS Enumeration", "Certificate Transparency", "Brute Force", "Passive Discovery"],
    href: "/tools/subdomain-finder",
    status: "available",
    difficulty: "Beginner",
  },
  {
    id: "port-scanner",
    name: "Port Scanner",
    description: "Fast and accurate port scanning with service detection",
    icon: <Network className="h-8 w-8" />,
    category: "Network Analysis",
    features: ["TCP/UDP Scanning", "Service Detection", "OS Fingerprinting", "Banner Grabbing"],
    href: "/tools/port-scanner",
    status: "available",
    difficulty: "Intermediate",
  },
  {
    id: "directory-buster",
    name: "Directory Buster",
    description: "Find hidden directories and files on web servers",
    icon: <Search className="h-8 w-8" />,
    category: "Web Testing",
    features: ["Directory Enumeration", "File Discovery", "Custom Wordlists", "Recursive Scanning"],
    href: "/tools/directory-buster",
    status: "coming-soon",
    difficulty: "Intermediate",
  },
  {
    id: "ssl-analyzer",
    name: "SSL/TLS Analyzer",
    description: "Comprehensive SSL/TLS configuration analysis",
    icon: <Lock className="h-8 w-8" />,
    category: "Cryptography",
    features: ["Certificate Analysis", "Cipher Suite Testing", "Protocol Support", "Vulnerability Checks"],
    href: "/tools/ssl-analyzer",
    status: "coming-soon",
    difficulty: "Advanced",
  },
  {
    id: "web-crawler",
    name: "Web Crawler",
    description: "Intelligent web crawling for comprehensive site mapping",
    icon: <Eye className="h-8 w-8" />,
    category: "Reconnaissance",
    features: ["Site Mapping", "Link Discovery", "Form Detection", "JavaScript Parsing"],
    href: "/tools/web-crawler",
    status: "beta",
    difficulty: "Intermediate",
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description: "Advanced DNS record analysis and enumeration",
    icon: <Database className="h-8 w-8" />,
    category: "Network Analysis",
    features: ["Record Types", "Zone Transfer", "Reverse DNS", "DNS History"],
    href: "/tools/dns-lookup",
    status: "available",
    difficulty: "Beginner",
  },
  {
    id: "whois-lookup",
    name: "WHOIS Lookup",
    description: "Domain registration and ownership information",
    icon: <FileText className="h-8 w-8" />,
    category: "Reconnaissance",
    features: ["Domain Info", "Registrar Details", "Contact Information", "Historical Data"],
    href: "/tools/whois-lookup",
    status: "available",
    difficulty: "Beginner",
  },
  {
    id: "wifi-analyzer",
    name: "WiFi Analyzer",
    description: "Wireless network security assessment",
    icon: <Wifi className="h-8 w-8" />,
    category: "Wireless Security",
    features: ["Network Discovery", "Security Analysis", "Signal Strength", "Encryption Detection"],
    href: "/tools/wifi-analyzer",
    status: "pro",
    difficulty: "Advanced",
  },
]

export function ToolsGrid() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
      case "beta":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "coming-soon":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "pro":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-foreground/10 text-foreground/60 border-foreground/20"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-foreground/10 text-foreground/60 border-foreground/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "beta":
        return "Beta"
      case "coming-soon":
        return "Coming Soon"
      case "pro":
        return "Pro Only"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
            <Target className="h-6 w-6 text-primary-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Security Tools</h1>
            <p className="text-foreground/60">Professional-grade cybersecurity testing tools</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg glass-panel">
            <div className="text-2xl font-bold text-primary-green">{tools.length}</div>
            <div className="text-sm text-foreground/60">Total Tools</div>
          </div>
          <div className="text-center p-4 rounded-lg glass-panel">
            <div className="text-2xl font-bold text-primary-green">
              {tools.filter((t) => t.status === "available").length}
            </div>
            <div className="text-sm text-foreground/60">Available</div>
          </div>
          <div className="text-center p-4 rounded-lg glass-panel">
            <div className="text-2xl font-bold text-primary-green">
              {tools.filter((t) => t.difficulty === "Beginner").length}
            </div>
            <div className="text-sm text-foreground/60">Beginner Friendly</div>
          </div>
          <div className="text-center p-4 rounded-lg glass-panel">
            <div className="text-2xl font-bold text-primary-green">{new Set(tools.map((t) => t.category)).size}</div>
            <div className="text-sm text-foreground/60">Categories</div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="glass-panel p-6 hover:border-primary-green/40 transition-all duration-300 group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20 group-hover:bg-primary-green/20 transition-colors">
                    <div className="text-primary-green">{tool.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary-green transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-foreground/60">{tool.category}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className={`text-xs ${getStatusColor(tool.status)}`}>
                    {getStatusLabel(tool.status)}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(tool.difficulty)}`}>
                    {tool.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/80 leading-relaxed">{tool.description}</p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground/80">Key Features:</h4>
                <div className="grid grid-cols-2 gap-1">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs text-foreground/60">
                      <Zap className="h-3 w-3 text-primary-green" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-primary-green/10">
                {tool.status === "available" || tool.status === "beta" ? (
                  <Link href={tool.href}>
                    <Button className="w-full cyber-button">
                      <Target className="h-4 w-4 mr-2" />
                      Launch Tool
                    </Button>
                  </Link>
                ) : tool.status === "pro" ? (
                  <Button className="w-full bg-transparent" variant="outline" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button className="w-full bg-transparent" variant="outline" disabled>
                    <Server className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
