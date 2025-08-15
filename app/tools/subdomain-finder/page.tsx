import { Header } from "@/components/layout/header"
import VerifiedSubdomainFinder from "@/components/tools/verified-subdomain-finder"

export default function SubdomainFinderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <<VerifiedSubdomainFinder /> />
        </div>
      </main>
    </div>
  )
}
