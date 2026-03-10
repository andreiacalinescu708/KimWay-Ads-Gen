import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdGenerator } from "@/components/ads/ad-generator"

export default async function GeneratePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generează Reclamă</h1>
        <p className="text-muted-foreground mt-1">
          Creează o reclamă video pentru produsul sau serviciul tău
        </p>
      </div>

      <AdGenerator />
    </div>
  )
}
