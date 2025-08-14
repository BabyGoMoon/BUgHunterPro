import { Header } from "@/components/layout/header"
import EnhancedSubdomainFinder from "@/components/tools/enhanced-subdomain-finder"

export default function SubdomainFinderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <EnhancedSubdomainFinder />
        </div>
      </main>
    </div>
  )
}
