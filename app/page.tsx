import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-green">Homepage Test Successful</h1>
          <p className="text-muted-foreground mt-4">The routing is working correctly. Ready for the final code.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
