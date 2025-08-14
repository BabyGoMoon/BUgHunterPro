"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ParticleBackground } from "@/components/ui/particle-background"
import { InteractiveGraph } from "@/components/ui/interactive-graph"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Play, Shield, Zap, Target, TrendingUp } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary-green/5" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? "animate-in slide-in-from-left duration-1000" : "opacity-0"}`}>
            {/* Badge */}
            <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20 hover:bg-primary-green/20 transition-colors">
              <Zap className="h-3 w-3 mr-1" />
              Advanced Cybersecurity Platform
            </Badge>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Hunt Bugs Like a
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-green via-vibrant-green to-teal-green bg-clip-text text-transparent animate-pulse">
                  Cyber Warrior
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed">
                Discover vulnerabilities with AI-powered scanning, real-time analysis, and gamified learning. Join
                thousands of security professionals advancing their skills.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-green">
                  <AnimatedCounter end={50000} duration={2000} />+
                </div>
                <div className="text-sm text-foreground/60">Vulnerabilities Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-vibrant-green">
                  <AnimatedCounter end={12000} duration={2000} />+
                </div>
                <div className="text-sm text-foreground/60">Active Hunters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-teal-green">
                  <AnimatedCounter end={99} duration={2000} />%
                </div>
                <div className="text-sm text-foreground/60">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="cyber-button text-lg px-8 py-4">
                <Shield className="h-5 w-5 mr-2" />
                Start Free Scan
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-green/20 hover:border-primary-green/40 hover:bg-primary-green/10 text-lg px-8 py-4 bg-transparent"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-6 border-t border-primary-green/10">
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <Target className="h-4 w-4 text-primary-green" />
                <span>OWASP Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <Shield className="h-4 w-4 text-primary-green" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <TrendingUp className="h-4 w-4 text-primary-green" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Graph */}
          <div className={`${isVisible ? "animate-in slide-in-from-right duration-1000 delay-300" : "opacity-0"}`}>
            <InteractiveGraph />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary-green rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-vibrant-green rounded-full animate-ping opacity-40" />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-teal-green rounded-full animate-bounce opacity-30" />
    </section>
  )
}
