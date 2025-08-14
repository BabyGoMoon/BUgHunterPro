import { Header } from "@/components/layout/header"
import UltimateScanner from "@/components/dashboard/ultimate-scanner"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 p-6">
        <UltimateScanner />
      </main>
    </div>
  )
}
