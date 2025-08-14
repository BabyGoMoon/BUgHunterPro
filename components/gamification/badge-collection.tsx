"use client"
import { Badge } from "@/components/ui/badge"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Trophy, Shield, Target, Zap, Award, Lock, Star, Crown } from "lucide-react"

interface BadgeItem {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  earnedDate?: string
  progress?: { current: number; total: number }
}

const badges: BadgeItem[] = [
  {
    id: "recon-rookie",
    name: "Recon Rookie",
    description: "Complete your first vulnerability scan",
    icon: <Target className="h-6 w-6" />,
    earned: true,
    rarity: "common",
    earnedDate: "2 weeks ago",
  },
  {
    id: "port-master",
    name: "Port Master",
    description: "Successfully scan 100 ports",
    icon: <Shield className="h-6 w-6" />,
    earned: true,
    rarity: "rare",
    earnedDate: "1 week ago",
  },
  {
    id: "subdomain-slayer",
    name: "Subdomain Slayer",
    description: "Discover 50 subdomains",
    icon: <Zap className="h-6 w-6" />,
    earned: true,
    rarity: "rare",
    earnedDate: "3 days ago",
  },
  {
    id: "sql-master",
    name: "SQL Master",
    description: "Find 25 SQL injection vulnerabilities",
    icon: <Trophy className="h-6 w-6" />,
    earned: true,
    rarity: "epic",
    earnedDate: "1 day ago",
  },
  {
    id: "xss-specialist",
    name: "XSS Specialist",
    description: "Identify 20 XSS vulnerabilities",
    icon: <Star className="h-6 w-6" />,
    earned: false,
    rarity: "epic",
    progress: { current: 15, total: 20 },
  },
  {
    id: "elite-hunter",
    name: "Elite Hunter",
    description: "Reach the top 10 on the leaderboard",
    icon: <Crown className="h-6 w-6" />,
    earned: false,
    rarity: "legendary",
    progress: { current: 42, total: 10 },
  },
  {
    id: "bug-bounty-king",
    name: "Bug Bounty King",
    description: "Find 500+ vulnerabilities",
    icon: <Award className="h-6 w-6" />,
    earned: false,
    rarity: "legendary",
    progress: { current: 423, total: 500 },
  },
  {
    id: "streak-warrior",
    name: "Streak Warrior",
    description: "Maintain a 30-day scanning streak",
    icon: <Zap className="h-6 w-6" />,
    earned: false,
    rarity: "rare",
    progress: { current: 7, total: 30 },
  },
]

export function BadgeCollection() {
  const getRarityColor = (rarity: BadgeItem["rarity"], earned: boolean) => {
    if (!earned) return "border-foreground/20 bg-foreground/5 text-foreground/40"

    switch (rarity) {
      case "common":
        return "border-gray-400/40 bg-gray-400/10 text-gray-300"
      case "rare":
        return "border-blue-400/40 bg-blue-400/10 text-blue-400"
      case "epic":
        return "border-purple-400/40 bg-purple-400/10 text-purple-400"
      case "legendary":
        return "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
    }
  }

  const getRarityLabel = (rarity: BadgeItem["rarity"]) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={`p-4 text-center space-y-3 transition-all duration-300 hover:scale-105 ${
            badge.earned
              ? `${getRarityColor(badge.rarity, badge.earned)} border-2 shadow-lg`
              : "glass-panel border border-foreground/20 opacity-60"
          }`}
        >
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                badge.earned ? "bg-background/20" : "bg-foreground/10"
              }`}
            >
              {badge.earned ? badge.icon : <Lock className="h-6 w-6 text-foreground/40" />}
            </div>
            {badge.earned && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                <Trophy className="h-3 w-3 text-black" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h4 className={`font-semibold text-sm ${badge.earned ? "" : "text-foreground/60"}`}>{badge.name}</h4>
            <p className={`text-xs ${badge.earned ? "text-current/80" : "text-foreground/40"}`}>{badge.description}</p>
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className={`text-xs ${getRarityColor(badge.rarity, badge.earned)} border-current/40`}
            >
              {getRarityLabel(badge.rarity)}
            </Badge>

            {badge.earned ? (
              <div className="text-xs text-current/60">Earned {badge.earnedDate}</div>
            ) : badge.progress ? (
              <div className="space-y-1">
                <div className="text-xs text-foreground/60">
                  {badge.progress.current} / {badge.progress.total}
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-1">
                  <div
                    className="bg-primary-green h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-foreground/40">Locked</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
