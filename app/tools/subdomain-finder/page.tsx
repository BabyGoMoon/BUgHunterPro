import { Header } from "@/components/layout/header"
import { UltimateSubdomainScanner } from "@/components/ui/ultimate-subdomain-scanner"

export default function SubdomainFinderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <UltimateSubdomainScanner />
      </main>
    </div>
  )
}
