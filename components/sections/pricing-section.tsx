"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Zap, Crown, Shield, Star } from "lucide-react"

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started with basic security testing",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <Shield className="h-6 w-6" />,
    features: [
      "5 scans per month",
      "Basic vulnerability detection",
      "Community support",
      "Learning hub access",
      "Basic reporting",
    ],
    limitations: ["Limited scan depth", "No API access", "No team collaboration"],
    popular: false,
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for professional security researchers",
    monthlyPrice: 29,
    yearlyPrice: 290,
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Unlimited scans",
      "Advanced vulnerability detection",
      "AI-powered suggestions",
      "Priority support",
      "Advanced reporting",
      "API access",
      "Custom scan profiles",
      "Export capabilities",
    ],
    limitations: [],
    popular: true,
    cta: "Start Pro Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for teams and organizations",
    monthlyPrice: 99,
    yearlyPrice: 990,
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "SSO integration",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Custom training",
      "White-label options",
    ],
    limitations: [],
    popular: false,
    cta: "Contact Sales",
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return "Free"
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    const period = isYearly ? "/year" : "/month"
    return `$${price}${period}`
  }

  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return null
    const yearlyTotal = plan.monthlyPrice * 12
    const savings = yearlyTotal - plan.yearlyPrice
    const percentage = Math.round((savings / yearlyTotal) * 100)
    return percentage > 0 ? `Save ${percentage}%` : null
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
            <Star className="h-4 w-4 text-primary-green" />
            <span className="text-sm font-medium text-primary-green">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-green via-vibrant-green to-teal-green bg-clip-text text-transparent">
              Security Plan
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Start free and scale as you grow. All plans include our core security testing features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? "text-foreground" : "text-foreground/60"}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary-green"
            />
            <span className={`text-sm ${isYearly ? "text-foreground" : "text-foreground/60"}`}>
              Yearly
              <Badge className="ml-2 bg-primary-green/10 text-primary-green border-primary-green/20">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative p-8 transition-all duration-500 hover:scale-105 animate-in slide-in-from-bottom ${
                plan.popular
                  ? "glass-panel border-2 border-primary-green/40 shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                  : "glass-panel hover:border-primary-green/40"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary-green to-vibrant-green text-black px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div
                      className={`p-3 rounded-xl border ${
                        plan.popular
                          ? "bg-primary-green/20 border-primary-green/40"
                          : "bg-primary-green/10 border-primary-green/20"
                      }`}
                    >
                      <div className="text-primary-green">{plan.icon}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-foreground/60 mt-2">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center space-y-2">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-primary-green">{getPrice(plan)}</span>
                  </div>
                  {isYearly && getSavings(plan) && (
                    <Badge variant="outline" className="bg-primary-green/10 text-primary-green border-primary-green/20">
                      {getSavings(plan)}
                    </Badge>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-primary-green shrink-0" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-primary-green/10">
                      <div className="text-xs text-foreground/50 mb-2">Limitations:</div>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <div key={limitationIndex} className="flex items-center space-x-3">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-1 h-1 bg-foreground/40 rounded-full" />
                            </div>
                            <span className="text-xs text-foreground/50">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "cyber-button"
                      : "border-primary-green/20 hover:border-primary-green/40 hover:bg-primary-green/10 bg-transparent"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center mt-16">
          <p className="text-foreground/60 mb-4">Have questions about our pricing?</p>
          <Button
            variant="outline"
            className="border-primary-green/20 hover:border-primary-green/40 hover:bg-primary-green/10 bg-transparent"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  )
}
