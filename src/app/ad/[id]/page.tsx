import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Download, RefreshCw, ArrowLeft, Play } from "lucide-react"

interface AdDetailPageProps {
  params: { id: string }
}

export default async function AdDetailPage({ params }: AdDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const ad = await db.ad.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!ad) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      generating: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.draft}>
        {status === "draft" && "Draft"}
        {status === "generating" && "Se generează..."}
        {status === "completed" && "Complet"}
        {status === "failed" && "Eroare"}
      </Badge>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Dashboard
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{ad.productName}</h1>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(ad.status)}
            {ad.hasWatermark && ad.status === "completed" && (
              <Badge variant="outline">Watermark</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {ad.status === "completed" && ad.videoUrl && (
            <>
              <Button asChild variant="outline">
                <a href={ad.videoUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Descarcă
                </a>
              </Button>
              <Link href={`/generate?regenerate=${ad.id}`}>
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerează
                </Button>
              </Link>
            </>
          )}
          {ad.status === "draft" && (
            <Link href={`/generate?regenerate=${ad.id}`}>
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Continuă
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {ad.videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Video Generat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  src={ad.videoUrl}
                  controls
                  className="w-full h-full"
                />
                {ad.hasWatermark && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Kimiway Ads Generator
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Script</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
              {ad.script}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalii Produs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Descriere
              </label>
              <p className="mt-1">{ad.productDescription}</p>
            </div>
            {ad.productImageUrl && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Imagine
                </label>
                <img
                  src={ad.productImageUrl}
                  alt={ad.productName}
                  className="mt-2 max-w-md rounded-lg"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Creat la
              </label>
              <p className="mt-1">
                {new Date(ad.createdAt).toLocaleString("ro-RO")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
