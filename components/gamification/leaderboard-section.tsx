"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, Zap, Target, Shield } from "lucide-react"

interface LeaderboardUser {
  id: string
  username: string
  avatar: string
  points: number
  rank: number
  scansCompleted: number
  vulnerabilitiesFound: number
  badges: string[]
  level: number
  title: string
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    username: "CyberNinja",
    avatar: "/cybersecurity-expert.png",
    points: 15420,
    rank: 1,
    scansCompleted: 342,
    vulnerabilitiesFound: 1205,
    badges: ["Elite Hunter", "SQL Master", "XSS Specialist", "Port Scanner"],
    level: 47,
    title: "Legendary Bug Hunter",
  },
  {
    id: "2",
    username: "SecurityQueen",
    avatar: "/female-hacker.png",
    points: 14890,
    rank: 2,
    scansCompleted: 298,
    vulnerabilitiesFound: 1089,
    badges: ["Recon Master", "CSRF Hunter", "Directory Traversal Pro"],
    level: 44,
    title: "Master Penetration Tester",
  },
  {
    id: "3",
    username: "WhiteHatPro",
    avatar: "/ethical-hacker.png",
    points: 13567,
    rank: 3,
    scansCompleted: 276,
    vulnerabilitiesFound: 967,
    badges: ["Bug Bounty King", "OWASP Expert", "Subdomain Slayer"],
    level: 41,
    title: "Senior Security Researcher",
  },
  {
    id: "4",
    username: "PentestGuru",
    avatar: "/security-professional.png",
    points: 12234,
    rank: 4,
    scansCompleted: 245,
    vulnerabilitiesFound: 823,
    badges: ["Port Master", "Vulnerability Analyst", "Recon Rookie"],
    level: 38,
    title: "Advanced Security Analyst",
  },
  {
    id: "5",
    username: "HackTheBox",
    avatar: "/cybersecurity-student.png",
    points: 11456,
    rank: 5,
    scansCompleted: 198,
    vulnerabilitiesFound: 734,
    badges: ["Learning Enthusiast", "CTF Champion", "Web App Hunter"],
    level: 35,
    title: "Junior Security Researcher",
  },
]

const timeframes = [
  { id: "weekly", label: "This Week" },
  { id: "monthly", label: "This Month" },
  { id: "alltime", label: "All Time" },
]

export function LeaderboardSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("alltime")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <div className="h-6 w-6 flex items-center justify-center text-foreground/60 font-bold">#{rank}</div>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
      case 3:
        return "bg-gradient-to-r from-amber-500 to-yellow-600 text-black"
      default:
        return "bg-primary-green/10 text-primary-green border-primary-green/20"
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
            <Trophy className="h-6 w-6 text-primary-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-foreground/60">Top bug hunters and security researchers</p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.id}
              variant={selectedTimeframe === timeframe.id ? "default" : "outline"}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className={
                selectedTimeframe === timeframe.id
                  ? "cyber-button"
                  : "border-primary-green/20 bg-transparent hover:bg-primary-green/10"
              }
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-3">
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              {mockLeaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-primary-green/5 ${
                    index < 3
                      ? "bg-gradient-to-r from-primary-green/5 to-transparent border border-primary-green/20"
                      : "bg-background/50"
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">{getRankIcon(user.rank)}</div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12 border-2 border-primary-green/20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-primary-green/10 text-primary-green">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{user.username}</h3>
                      <Badge className={getRankBadgeColor(user.rank)}>Level {user.level}</Badge>
                    </div>
                    <p className="text-sm text-foreground/60 truncate">{user.title}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-foreground/50">
                      <span className="flex items-center space-x-1">
                        <Target className="h-3 w-3" />
                        <span>{user.scansCompleted} scans</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>{user.vulnerabilitiesFound} vulns</span>
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-green">{user.points.toLocaleString()}</div>
                    <div className="text-xs text-foreground/60">points</div>
                  </div>

                  {/* Badges Preview */}
                  <div className="hidden sm:flex items-center space-x-1">
                    {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <div
                        key={badgeIndex}
                        className="w-6 h-6 rounded-full bg-primary-green/20 border border-primary-green/40 flex items-center justify-center"
                        title={badge}
                      >
                        <Award className="h-3 w-3 text-primary-green" />
                      </div>
                    ))}
                    {user.badges.length > 3 && (
                      <div className="text-xs text-foreground/60">+{user.badges.length - 3}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Your Rank */}
          <Card className="glass-panel p-6">
            <div className="text-center space-y-4">
              <div className="p-3 rounded-full bg-primary-green/10 border border-primary-green/20 w-fit mx-auto">
                <Zap className="h-8 w-8 text-primary-green" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-green">Your Rank</h3>
                <div className="text-3xl font-bold text-foreground mt-2">#42</div>
                <p className="text-sm text-foreground/60">Out of 15,847 hunters</p>
              </div>
              <div className="pt-4 border-t border-primary-green/20">
                <div className="text-lg font-bold text-primary-green">8,234</div>
                <div className="text-xs text-foreground/60">Total Points</div>
              </div>
            </div>
          </Card>

          {/* Weekly Challenge */}
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary-green" />
                <h3 className="font-semibold text-primary-green">Weekly Challenge</h3>
              </div>
              <div>
                <h4 className="font-medium mb-2">SQL Injection Master</h4>
                <p className="text-sm text-foreground/60 mb-3">Find 5 SQL injection vulnerabilities this week</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-primary-green">3/5</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-green to-vibrant-green h-2 rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-primary-green/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-green">+500</div>
                  <div className="text-xs text-foreground/60">Bonus Points</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Achievements */}
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary-green" />
                <h3 className="font-semibold text-primary-green">Recent Achievements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded bg-primary-green/5">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Port Master</div>
                    <div className="text-xs text-foreground/60">Completed 100 port scans</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded bg-primary-green/5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Recon Rookie</div>
                    <div className="text-xs text-foreground/60">First successful scan</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
