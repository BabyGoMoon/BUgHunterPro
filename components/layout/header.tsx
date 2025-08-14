"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Shield, Menu, X, Zap, Target, Users, BookOpen, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/tools", label: "Tools", icon: Target },
    { href: "/dashboard", label: "Dashboard", icon: Zap },
    { href: "/leaderboard", label: "Leaderboard", icon: Users },
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/reports", label: "Reports", icon: FileText },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-panel border-b border-primary-green/20 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary-green group-hover:animate-pulse transition-all duration-300" />
              <div className="absolute inset-0 bg-primary-green/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-green to-vibrant-green bg-clip-text text-transparent">
              BugHunter Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-foreground/80 hover:text-primary-green transition-colors duration-300 group"
                >
                  <Icon className="h-4 w-4 group-hover:animate-pulse" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="border-primary-green/20 hover:border-primary-green/40 bg-transparent">
              Sign In
            </Button>
            <Button className="cyber-button">Start Scanning</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="border border-primary-green/20 hover:border-primary-green/40"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-primary-green" />
              ) : (
                <Menu className="h-5 w-5 text-primary-green" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel mt-2 rounded-lg border border-primary-green/20">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-foreground/80 hover:text-primary-green transition-colors duration-300 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-primary-green/20 space-y-2">
                <Button variant="outline" className="w-full border-primary-green/20 bg-transparent">
                  Sign In
                </Button>
                <Button className="w-full cyber-button">Start Scanning</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
