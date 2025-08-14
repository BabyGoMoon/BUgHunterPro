"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCollection } from "@/components/gamification/badge-collection"
import { ActivityChart } from "@/components/gamification/activity-chart"
import { User, Trophy, Target, Shield, Zap, Calendar, Award, TrendingUp } from "lucide-react"

const userStats = {
  username: "CyberWarrior",
  title: "Advanced Security Analyst",
  level: 28,
  currentXP: 7420,
  nextLevelXP: 8000,
  totalPoints: 8234,
  rank: 42,
  joinDate: "March 2023",
  scansCompleted: 156,
  vulnerabilitiesFound: 423,
  badgesEarned: 12,
  streakDays: 7,
}

const recentActivity = [
  { date: "2024-01-15", scans: 3, vulns: 8, points: 120 },
  { date: "2024-01-14", scans: 2, vulns: 5, points: 85 },
  { date: "2024-01-13", scans: 4, vulns: 12, points: 180 },
  { date: "2024-01-12", scans: 1, vulns: 3, points: 45 },
  { date: "2024-01-11", scans: 5, vulns: 15, points: 225 },
  { date: "2024-01-10", scans: 2, vulns: 6, points: 90 },
  { date: "2024-01-09", scans: 3, vulns: 9, points: 135 },
]

export function UserProfile() {
  const xpProgress = (userStats.currentXP / userStats.nextLevelXP) * 100

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20">
            <User className="h-6 w-6 text-primary-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-foreground/60">Track your progress and achievements</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="glass-panel p-6">
            <div className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto border-4 border-primary-green/20">
                <AvatarImage src="/cybersecurity-professional.png" alt={userStats.username} />
                <AvatarFallback className="bg-primary-green/10 text-primary-green text-2xl">
                  {userStats.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-bold text-foreground">{userStats.username}</h2>
                <p className="text-foreground/60">{userStats.title}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Calendar className="h-4 w-4 text-foreground/40" />
                  <span className="text-sm text-foreground/60">Joined {userStats.joinDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-primary-green/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-green">#{userStats.rank}</div>
                  <div className="text-xs text-foreground/60">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-green">{userStats.level}</div>
                  <div className="text-xs text-foreground/60">Level</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Level Progress */}
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary-green">Level Progress</h3>
                <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20">
                  Level {userStats.level}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP Progress</span>
                  <span className="text-primary-green">
                    {userStats.currentXP.toLocaleString()} / {userStats.nextLevelXP.toLocaleString()}
                  </span>
                </div>
                <Progress value={xpProgress} className="h-3">
                  <div
                    className="h-full bg-gradient-to-r from-primary-green to-vibrant-green transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${xpProgress}%` }}
                  />
                </Progress>
                <div className="text-xs text-foreground/60 text-center">
                  {userStats.nextLevelXP - userStats.currentXP} XP to next level
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary-green">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-primary-green/5 border border-primary-green/10">
                  <Target className="h-6 w-6 text-primary-green mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">{userStats.scansCompleted}</div>
                  <div className="text-xs text-foreground/60">Scans</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary-green/5 border border-primary-green/10">
                  <Shield className="h-6 w-6 text-primary-green mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">{userStats.vulnerabilitiesFound}</div>
                  <div className="text-xs text-foreground/60">Vulnerabilities</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary-green/5 border border-primary-green/10">
                  <Award className="h-6 w-6 text-primary-green mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">{userStats.badgesEarned}</div>
                  <div className="text-xs text-foreground/60">Badges</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary-green/5 border border-primary-green/10">
                  <Zap className="h-6 w-6 text-primary-green mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">{userStats.streakDays}</div>
                  <div className="text-xs text-foreground/60">Day Streak</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Activity & Badges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary-green" />
                <h3 className="font-semibold text-primary-green">Activity Overview</h3>
              </div>
              <Badge variant="outline" className="border-primary-green/20 text-primary-green">
                Last 7 Days
              </Badge>
            </div>
            <ActivityChart data={recentActivity} />
          </Card>

          {/* Badge Collection */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary-green" />
                <h3 className="font-semibold text-primary-green">Badge Collection</h3>
              </div>
              <Badge variant="outline" className="border-primary-green/20 text-primary-green">
                {userStats.badgesEarned} Earned
              </Badge>
            </div>
            <BadgeCollection />
          </Card>

          {/* Recent Achievements */}
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary-green" />
                <h3 className="font-semibold text-primary-green">Recent Achievements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary-green/5 border border-primary-green/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium">Vulnerability Hunter</div>
                      <div className="text-sm text-foreground/60">Found 100+ vulnerabilities</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary-green">+250 XP</div>
                    <div className="text-xs text-foreground/60">2 days ago</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary-green/5 border border-primary-green/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Scan Master</div>
                      <div className="text-sm text-foreground/60">Completed 150 scans</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary-green">+200 XP</div>
                    <div className="text-xs text-foreground/60">5 days ago</div>
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
