"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Play, Download, RefreshCw, Eye } from "lucide-react"

interface Ad {
  id: string
  productName: string
  status: string
  videoUrl: string | null
  hasWatermark: boolean
  createdAt: string
}

export function AdsHistory() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/ads")
      if (response.ok) {
        const data = await response.json()
        setAds(data.ads)
      }
    } catch (error) {
      console.error("Error fetching ads:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      generating: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }
    const labels = {
      draft: "Draft",
      generating: "Se generează...",
      completed: "Complet",
      failed: "Eroare",
    }
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.draft}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Istoric Reclame</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (ads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Istoric Reclame</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nu ai generat nicio reclamă încă
            </p>
            <Link href="/generate">
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Generează Prima Reclamă
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Istoric Reclame</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{ad.productName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(ad.status)}
                  {ad.hasWatermark && ad.status === "completed" && (
                    <Badge variant="outline">Watermark</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(ad.createdAt).toLocaleDateString("ro-RO")}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {ad.status === "completed" && ad.videoUrl && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <a href={ad.videoUrl} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Link href={`/generate?regenerate=${ad.id}`}>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
                <Link href={`/ad/${ad.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
