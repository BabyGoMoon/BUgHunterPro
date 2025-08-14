"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function MrCriminalHero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Simple scroll effect without GSAP
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY
        const rate = scrolled * -0.5
        heroRef.current.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#050807] text-white">
      {/* Background grid/glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(1200px 600px at 80% 20%, rgba(0,255,136,0.15), transparent 60%), radial-gradient(800px 400px at 20% 80%, rgba(0,255,136,0.08), transparent 60%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:py-24">
        {/* Copy */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Hunt Bugs Like a <span className="text-primary-green animate-pulse">Cyber Warrior</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-green/80">
            Discover vulnerabilities with AI-powered scanning, real-time analysis, and gamified learning. Join thousands
            of security professionals advancing their skills.
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="glass-panel p-3">
              <div className="text-2xl font-bold text-primary-green">50,000+</div>
              <div className="text-xs text-muted-foreground">Vulnerabilities</div>
            </div>
            <div className="glass-panel p-3">
              <div className="text-2xl font-bold text-primary-green">12,000+</div>
              <div className="text-xs text-muted-foreground">Active Hunters</div>
            </div>
            <div className="glass-panel p-3">
              <div className="text-2xl font-bold text-primary-green">99%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button asChild className="cyber-button">
              <a href="/dashboard">Start Bug Hunting</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-primary-green/40 text-primary-green hover:border-vibrant-green hover:text-vibrant-green bg-transparent"
            >
              <a href="/learn">Learn More</a>
            </Button>
          </div>
          <div className="mt-6 text-xs uppercase tracking-widest text-primary-green/60">
            Advanced Cybersecurity Platform
          </div>
        </div>

        {/* Visual Element */}
        <div className="md:w-1/2">
          <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-primary-green/20 bg-gradient-to-br from-black/30 to-primary-green/5 shadow-2xl backdrop-blur">
            {/* Animated cyber elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Central hub */}
                <div className="h-32 w-32 rounded-full border-2 border-primary-green bg-primary-green/10 animate-pulse flex items-center justify-center">
                  <div
                    className="h-16 w-16 rounded-full border border-vibrant-green bg-vibrant-green/20 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>

                {/* Orbiting elements */}
                <div className="absolute -inset-16">
                  <div className="h-full w-full animate-spin" style={{ animationDuration: "10s" }}>
                    <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary-green shadow-lg shadow-primary-green/50" />
                    <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-vibrant-green shadow-lg shadow-vibrant-green/50" />
                    <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-lime-green shadow-lg shadow-lime-green/50" />
                    <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary-green shadow-lg shadow-primary-green/50" />
                  </div>
                </div>

                {/* Floating text */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-2xl font-bold text-primary-green animate-pulse">BugHunter Pro</div>
                  <div className="text-sm text-primary-green/60">AI-Powered Security</div>
                </div>
              </div>
            </div>

            {/* Scan lines effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full bg-gradient-to-b from-transparent via-primary-green/10 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
