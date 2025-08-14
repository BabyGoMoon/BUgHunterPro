import { Header } from "@/components/layout/header"
import { PortScanner } from "@/components/tools/port-scanner"

export default function PortScannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PortScanner />
      </main>
    </div>
  )
}
