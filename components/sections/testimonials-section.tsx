"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Penetration Tester",
    company: "CyberSec Corp",
    avatar: "/security-expert-1.png",
    rating: 5,
    content:
      "BugHunter Pro has revolutionized our security testing workflow. The AI-powered suggestions are incredibly accurate, and the gamification keeps our team motivated. We've increased our vulnerability discovery rate by 300%.",
    specialization: "Web Application Security",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Bug Bounty Hunter",
    company: "Independent Researcher",
    avatar: "/bug-bounty-hunter.png",
    rating: 5,
    content:
      "As a full-time bug bounty hunter, I need tools that are fast, accurate, and reliable. BugHunter Pro delivers on all fronts. The subdomain finder alone has helped me discover critical vulnerabilities worth $50K+.",
    specialization: "Bug Bounty Programs",
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Cybersecurity Professor",
    company: "Tech University",
    avatar: "/cybersecurity-professor.png",
    rating: 5,
    content:
      "I use BugHunter Pro in my advanced cybersecurity courses. The learning hub and gamification features make complex security concepts accessible to students. It's an excellent educational platform.",
    specialization: "Security Education",
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Security Architect",
    company: "Fortune 500 Company",
    avatar: "/security-architect.png",
    rating: 5,
    content:
      "The comprehensive reporting and analytics in BugHunter Pro help us track our security posture over time. The executive dashboards make it easy to communicate security metrics to leadership.",
    specialization: "Enterprise Security",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-green/5 to-background" />
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-green/10 border border-primary-green/20 rounded-full px-4 py-2 mb-6">
            <Quote className="h-4 w-4 text-primary-green" />
            <span className="text-sm font-medium text-primary-green">What Our Users Say</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Trusted by Security
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-green via-vibrant-green to-teal-green bg-clip-text text-transparent">
              Professionals Worldwide
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Join thousands of penetration testers, bug bounty hunters, and security researchers who trust BugHunter Pro
            for their cybersecurity needs.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="glass-panel p-8 lg:p-12 relative">
            <div className="absolute top-6 left-6 text-primary-green/20">
              <Quote className="h-12 w-12" />
            </div>

            <div className="space-y-8">
              {/* Content */}
              <div className="text-center space-y-6">
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary-green text-primary-green" />
                  ))}
                </div>

                <blockquote className="text-xl lg:text-2xl text-foreground/90 leading-relaxed font-medium">
                  "{currentTestimonial.content}"
                </blockquote>
              </div>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-primary-green/20">
                  <AvatarImage src={currentTestimonial.avatar || "/placeholder.svg"} alt={currentTestimonial.name} />
                  <AvatarFallback className="bg-primary-green/10 text-primary-green text-lg">
                    {currentTestimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-semibold text-foreground text-lg">{currentTestimonial.name}</div>
                  <div className="text-foreground/60">{currentTestimonial.role}</div>
                  <div className="text-sm text-foreground/50">{currentTestimonial.company}</div>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-primary-green/10 text-primary-green border-primary-green/20"
                  >
                    {currentTestimonial.specialization}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="border-primary-green/20 hover:border-primary-green/40 hover:bg-primary-green/10 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dots */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary-green scale-125"
                    : "bg-primary-green/30 hover:bg-primary-green/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="border-primary-green/20 hover:border-primary-green/40 hover:bg-primary-green/10 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
