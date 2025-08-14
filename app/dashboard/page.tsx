import { Header } from "@/components/layout/header"
import UltimateVulnerabilityScanner from "@/components/scanning/ultimate-vulnerability-scanner"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary-green header-title">Ultimate Security Dashboard</h1>
            <p className="text-muted-foreground">
              Advanced vulnerability scanning with OWASP Top 10 coverage and real-time confirmation
            </p>
          </div>
          <UltimateVulnerabilityScanner />
        </div>
      </main>
    </div>
  )
}
