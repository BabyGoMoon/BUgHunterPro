import { Header } from "@/components/layout/header"
import { WhoisLookup } from "@/components/tools/whois-lookup"

export default function WhoisLookupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-green to-vibrant-green bg-clip-text text-transparent mb-4">
                WHOIS Lookup Tool
              </h1>
              <p className="text-muted-foreground">
                Get comprehensive domain registration information and ownership details
              </p>
            </div>
            <WhoisLookup />
          </div>
        </div>
      </main>
    </div>
  )
}
