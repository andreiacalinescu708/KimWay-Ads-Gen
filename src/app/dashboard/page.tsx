import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { TokenDisplay } from "@/components/dashboard/token-display"
import { AdsHistory } from "@/components/dashboard/ads-history"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bun venit, {session.user?.name}!
          </p>
        </div>
        <Link href="/generate">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Generează Reclamă Nouă
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <TokenDisplay />
        <AdsHistory />
      </div>
    </div>
  )
}
