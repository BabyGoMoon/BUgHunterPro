import { Header } from "@/components/layout/header"
import { UserProfile } from "@/components/gamification/user-profile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <UserProfile />
      </main>
    </div>
  )
}
