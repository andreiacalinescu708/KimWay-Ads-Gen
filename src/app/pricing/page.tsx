"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface TokenPackage {
  id: string
  name: string
  description: string | null
  price: number
  tokenAmount: number
}

export default function PricingPage() {
  const [packages, setPackages] = useState<TokenPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      // For now, use hardcoded packages
      // In production, fetch from /api/admin/packages
      setPackages([
        {
          id: "starter",
          name: "Starter",
          description: "Perfect pentru început",
          price: 999,
          tokenAmount: 50,
        },
        {
          id: "pro",
          name: "Pro",
          description: "Cel mai popular",
          price: 2499,
          tokenAmount: 150,
        },
        {
          id: "enterprise",
          name: "Enterprise",
          description: "Pentru echipe mari",
          price: 9999,
          tokenAmount: 700,
        },
      ])
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (packageId: string) => {
    setCheckoutLoading(packageId)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setCheckoutLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Prețuri</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Alege pachetul potrivit pentru nevoile tale. Cu cât cumperi mai multe tokenuri, 
          cu atât economisești mai mult.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={pkg.name === "Pro" ? "border-primary" : ""}>
            <CardHeader>
              {pkg.name === "Pro" && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded w-fit mb-2">
                  Popular
                </span>
              )}
              <CardTitle>{pkg.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  {(pkg.price / 100).toFixed(2)}€
                </span>
              </div>
              <div className="mb-6">
                <span className="text-2xl font-semibold text-primary">
                  {pkg.tokenAmount}
                </span>
                <span className="text-muted-foreground"> tokenuri</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ~{Math.floor(pkg.tokenAmount / 10)} video-uri
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Fără watermark
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Script generat de AI
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Regenerare disponibilă
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={() => handleCheckout(pkg.id)}
                disabled={checkoutLoading === pkg.id}
              >
                {checkoutLoading === pkg.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Cumpără"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Costuri Tokenuri</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Generare Video</p>
            <p className="text-2xl font-bold text-primary">10 tokenuri</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Regenerare Video</p>
            <p className="text-2xl font-bold text-primary">5 tokenuri</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Edit + Regenerare</p>
            <p className="text-2xl font-bold text-primary">8 tokenuri</p>
          </div>
        </div>
      </div>
    </div>
  )
}
