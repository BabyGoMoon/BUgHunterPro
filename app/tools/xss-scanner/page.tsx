import { Header } from "@/components/layout/header"
import { XssPayloadGenerator } from "@/components/tools/xss-payload-generator"

export default function XssScannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-4xl mx-auto">
          <XssPayloadGenerator />
        </div>
      </main>
    </div>
  )
}
