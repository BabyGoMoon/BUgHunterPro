import { Header } from "@/components/layout/header"
import { EnhancedWebCrawler } from "@/components/tools/enhanced-web-crawler"

export default function WebCrawlerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-green to-vibrant-green bg-clip-text text-transparent mb-4">
                Enhanced Web Crawler
              </h1>
              <p className="text-muted-foreground">
                Comprehensive website analysis with link discovery, technology detection, and security assessment
              </p>
            </div>
            <EnhancedWebCrawler />
          </div>
        </div>
      </main>
    </div>
  )
}
