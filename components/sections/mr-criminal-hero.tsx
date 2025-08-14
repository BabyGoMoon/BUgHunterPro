"use client"

import { Button } from "@/components/ui/button"

export default function MrCriminalHero() {
  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#050807] text-white flex items-center justify-center">
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
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Hunt Bugs Like a <span className="text-primary-green animate-pulse">Cyber Warrior</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-green/80">
            Discover vulnerabilities with AI-powered scanning, real-time analysis, and gamified learning. Join thousands
            of security professionals advancing their skills.
          </p>
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
      </div>
    </section>
  )
}
