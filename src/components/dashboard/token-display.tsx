"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Gift } from "lucide-react"

export function TokenDisplay() {
  const [tokens, setTokens] = useState<number>(0)
  const [freeUsed, setFreeUsed] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/user/tokens")
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens)
        setFreeUsed(data.freeUsed)
      }
    } catch (error) {
      console.error("Error fetching tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tokenuri Disponibile
          </CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tokenuri Disponibile
          </CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tokens}</div>
          <p className="text-xs text-muted-foreground">
            Folosește tokenuri pentru a genera reclame
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Generare Gratuită
          </CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {freeUsed ? "Folosită" : "Disponibilă"}
          </div>
          <p className="text-xs text-muted-foreground">
            {freeUsed 
              ? "Ai folosit deja generarea gratuită" 
              : "1 generare gratuită cu watermark"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
