"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Target, Users, Brain, Award, TrendingUp, Lock } from "lucide-react"

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Advanced Vulnerability Detection",
    description: "AI-powered scanning engine that identifies OWASP Top 10 vulnerabilities with 99.9% accuracy.",
    benefits: ["Real-time analysis", "False positive reduction", "Comprehensive coverage"],
    category: "Security",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning-Fast Scanning",
    description: "Optimized scanning algorithms deliver results in seconds, not hours.",
    benefits: ["Sub-second response", "Parallel processing", "Smart caching"],
    category: "Performance",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "AI-Powered Suggestions",
    description: "Get intelligent remediation advice from our cybersecurity AI assistant.",
    benefits: ["Contextual fixes", "Best practices", "Code examples"],
    category: "Intelligence",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborative Platform",
    description: "Share findings, compete on leaderboards, and learn from the community.",
    benefits: ["Team workspaces", "Knowledge sharing", "Peer learning"],
    category: "Community",
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Gamified Learning",
    description: "Earn badges, climb leaderboards, and unlock achievements as you improve.",
    benefits: ["Progress tracking", "Skill validation", "Motivation system"],
    category: "Gamification",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Comprehensive reporting and analytics to track your security posture over time.",
    benefits: ["Trend analysis", "Risk scoring", "Executive reports"],
    category: "Analytics",
  },
]

const stats = [
  { value: "50,000+", label: "Vulnerabilities Found", icon: <Target className="h-5 w-5" /> },
  { value: "12,000+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
  { value: "99.9%", label: "Uptime", icon: <Shield className="h-5 w-5" /> },
  { value: "<2s", label: "Average Scan Time", icon: <Zap className="h-5 w-5" /> },
]

export function FeaturesSection() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Security":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Performance":
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
      case "Intelligence":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Community":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Gamification":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Analytics":
        return "bg-teal-500/10 text-teal-400 border-teal-500/20"
      default:
        return "bg-foreground/10 text-foreground/60 border-foreground/20"
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-green/5 via-background to-primary-green/5" />
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-green/10 border border-primary-green/20 rounded-full px-4 py-2 mb-6">
            <Lock className="h-4 w-4 text-primary-green" />
            <span className="text-sm font-medium text-primary-green">Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Everything You Need for
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-green via-vibrant-green to-teal-green bg-clip-text text-transparent">
              Professional Security Testing
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            From advanced vulnerability detection to gamified learning experiences, BugHunter Pro provides all the tools
            and features you need to excel in cybersecurity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass-panel p-6 text-center animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
                  <div className="text-primary-green">{stat.icon}</div>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-green mb-1">{stat.value}</div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-panel p-8 hover:border-primary-green/40 transition-all duration-500 group animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-primary-green/10 border border-primary-green/20 group-hover:bg-primary-green/20 transition-colors">
                    <div className="text-primary-green group-hover:scale-110 transition-transform">{feature.icon}</div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(feature.category)}`}>
                    {feature.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary-green transition-colors mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground/80">Key Benefits:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2 text-sm text-foreground/60">
                          <div className="w-1.5 h-1.5 bg-primary-green rounded-full" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
