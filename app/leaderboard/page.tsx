import { Header } from "@/components/layout/header"
import { LeaderboardSection } from "@/components/gamification/leaderboard-section"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <LeaderboardSection />
      </main>
    </div>
  )
}
