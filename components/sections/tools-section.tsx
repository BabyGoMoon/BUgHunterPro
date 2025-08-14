"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Network, Search, Target, ArrowRight } from "lucide-react"

const featuredTools = [
  {
    id: "vulnerability-scanner",
    name: "Vulnerability Scanner",
    description: "Comprehensive security assessment with OWASP Top 10 coverage and real-time analysis.",
    icon: <Shield className="h-8 w-8" />,
    href: "/dashboard",
    features: ["SQL Injection", "XSS Detection", "CSRF Analysis"],
    status: "Popular",
  },
  {
    id: "subdomain-finder",
    name: "Subdomain Finder",
    description: "Discover hidden subdomains using DNS enumeration and certificate transparency.",
    icon: <Globe className="h-8 w-8" />,
    href: "/tools/subdomain-finder",
    features: ["DNS Enumeration", "Passive Discovery", "Certificate Logs"],
    status: "New",
  },
  {
    id: "port-scanner",
    name: "Port Scanner",
    description: "Fast and accurate port scanning with service detection and banner grabbing.",
    icon: <Network className="h-8 w-8" />,
    href: "/tools/port-scanner",
    features: ["Service Detection", "Banner Grabbing", "Custom Ranges"],
    status: "Updated",
  },
]

export function ToolsSection() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Popular":
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
      case "New":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Updated":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-foreground/10 text-foreground/60 border-foreground/20"
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-green/5 to-background" />
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-green/10 border border-primary-green/20 rounded-full px-4 py-2 mb-6">
            <Target className="h-4 w-4 text-primary-green" />
            <span className="text-sm font-medium text-primary-green">Professional Security Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Advanced Cybersecurity
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-green via-vibrant-green to-teal-green bg-clip-text text-transparent">
              Testing Arsenal
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Professional-grade security tools designed for penetration testers, bug bounty hunters, and security
            researchers. Discover vulnerabilities with precision and efficiency.
          </p>
        </div>

        {/* Featured Tools Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredTools.map((tool, index) => (
            <Card
              key={tool.id}
              className="glass-panel p-8 hover:border-primary-green/40 transition-all duration-500 group animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-primary-green/10 border border-primary-green/20 group-hover:bg-primary-green/20 transition-colors">
                    <div className="text-primary-green group-hover:scale-110 transition-transform">{tool.icon}</div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(tool.status)}`}>
                    {tool.status}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary-green transition-colors mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">{tool.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground/80">Key Features:</h4>
                    <div className="space-y-1">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm text-foreground/60">
                          <div className="w-1.5 h-1.5 bg-primary-green rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <Link href={tool.href}>
                  <Button className="w-full cyber-button group-hover:scale-105 transition-transform">
                    <span>Try {tool.name}</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/tools">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-green/20 hover:border-primary-green/40 hover:bg-primary-green/10 bg-transparent text-lg px-8 py-4"
            >
              <Search className="h-5 w-5 mr-2" />
              Explore All Tools
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
