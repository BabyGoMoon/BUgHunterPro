import { Header } from "@/components/layout/header"
import { ToolsGrid } from "@/components/tools/tools-grid"

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ToolsGrid />
      </main>
    </div>
  )
}
