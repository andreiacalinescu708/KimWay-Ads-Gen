"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Play, 
  Download, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"

const VIDEO_GENERATION_COST = 10
const VIDEO_REGENERATION_COST = 5
const EDIT_SCRIPT_REGENERATE_COST = 8

export function AdGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const regenerateId = searchParams.get("regenerate")

  const [step, setStep] = useState<"product" | "script" | "video">("product")
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productImage, setProductImage] = useState<File | null>(null)
  const [script, setScript] = useState("")
  const [adId, setAdId] = useState<string | null>(regenerateId)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [hasWatermark, setHasWatermark] = useState(true)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokens, setTokens] = useState(0)
  const [freeUsed, setFreeUsed] = useState(true)
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"generate" | "regenerate" | null>(null)

  useEffect(() => {
    fetchUserTokens()
    if (regenerateId) {
      fetchAdDetails(regenerateId)
    }
  }, [regenerateId])

  const fetchUserTokens = async () => {
    try {
      const response = await fetch("/api/user/tokens")
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens)
        setFreeUsed(data.freeUsed)
      }
    } catch (error) {
      console.error("Error fetching tokens:", error)
    }
  }

  const fetchAdDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/ads/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProductName(data.ad.productName)
        setProductDescription(data.ad.productDescription)
        setScript(data.ad.script)
        setVideoUrl(data.ad.videoUrl)
        setHasWatermark(data.ad.hasWatermark)
        setStep("script")
      }
    } catch (error) {
      console.error("Error fetching ad:", error)
    }
  }

  const generateScript = async () => {
    if (!productName || !productDescription) {
      setError("Te rugăm să completezi toate câmpurile obligatorii")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/kimi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDescription,
          productImageUrl: null, // TODO: Upload image
        }),
      })

      if (!response.ok) {
        throw new Error("Eroare la generarea scriptului")
      }

      const data = await response.json()
      setScript(data.script)

      // Create ad in database
      const adResponse = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDescription,
          productImageUrl: null,
          script: data.script,
        }),
      })

      if (adResponse.ok) {
        const adData = await adResponse.json()
        setAdId(adData.ad.id)
      }

      setStep("script")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVideo = (isFree: boolean = false) => {
    if (!adId) return

    const cost = regenerateId ? VIDEO_REGENERATION_COST : VIDEO_GENERATION_COST
    
    if (!isFree && tokens < cost) {
      setError(`Nu ai suficiente tokenuri. Ai nevoie de ${cost} tokenuri.`)
      return
    }

    setConfirmAction(isFree ? "generate" : "regenerate")
    setShowConfirmDialog(true)
  }

  const confirmGenerateVideo = async (isFree: boolean = false) => {
    if (!adId) return

    setLoading(true)
    setError(null)
    setShowConfirmDialog(false)

    try {
      const response = await fetch("/api/runway/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId,
          isFree,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Eroare la generarea video")
      }

      // Poll for video status
      pollVideoStatus()
      setStep("video")
      fetchUserTokens()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pollVideoStatus = async () => {
    // Simplified - in production, poll the status endpoint
    setTimeout(() => {
      setVideoUrl("/api/placeholder-video.mp4") // Placeholder
    }, 3000)
  }

  const handleRegenerateScript = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/kimi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDescription,
          productImageUrl: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Eroare la regenerarea scriptului")
      }

      const data = await response.json()
      setScript(data.script)

      // Update ad
      if (adId) {
        await fetch(`/api/ads/${adId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ script: data.script }),
        })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateScript = async () => {
    if (!adId) return

    try {
      await fetch(`/api/ads/${adId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      })
      alert("Script salvat!")
    } catch (error) {
      console.error("Error saving script:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { id: "product", label: "Produs" },
            { id: "script", label: "Script" },
            { id: "video", label: "Video" },
          ].map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : step === "script" && s.id === "product"
                    ? "bg-green-500 text-white"
                    : step === "video"
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step === "video" || (step === "script" && index === 0) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="ml-2 text-sm font-medium">{s.label}</span>
              {index < 2 && (
                <div className="w-16 h-1 mx-4 bg-muted" />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Step 1: Product Info */}
      {step === "product" && (
        <Card>
          <CardHeader>
            <CardTitle>Informații Produs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Numele Produsului / Serviciului *
              </label>
              <Input
                placeholder="Ex: Cremă hidratantă organică"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Descriere Detaliată *
              </label>
              <Textarea
                placeholder="Descrie produsul sau serviciul tău în detaliu..."
                rows={5}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Imagine Produs (Opțional)
              </label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click pentru a încărca sau drag & drop
                </p>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={generateScript}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se generează scriptul...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generează Scriptul
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Script */}
      {step === "script" && (
        <Card>
          <CardHeader>
            <CardTitle>Script Generat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRegenerateScript}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generează Altul
              </Button>
              <Button variant="outline" onClick={handleUpdateScript}>
                <Save className="mr-2 h-4 w-4" />
                Salvează Modificări
              </Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Generează Video</h4>
              
              {!freeUsed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">
                        Ai o generare gratuită!
                      </p>
                      <p className="text-sm text-green-600">
                        Prima generare include watermark Kimiway Ads Generator
                      </p>
                    </div>
                    <Button onClick={() => handleGenerateVideo(true)}>
                      <Play className="mr-2 h-4 w-4" />
                      Generează Gratis
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">
                      Generează fără watermark
                    </p>
                    <p className="text-sm text-blue-600">
                      Cost: {VIDEO_GENERATION_COST} tokenuri
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Tokenuri disponibile: {tokens}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleGenerateVideo(false)}
                    disabled={tokens < VIDEO_GENERATION_COST}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generează Video
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Video */}
      {step === "video" && (
        <Card>
          <CardHeader>
            <CardTitle>Video Generat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {videoUrl ? (
              <>
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                  />
                  {hasWatermark && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Kimiway Ads Generator
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href={videoUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Descarcă Video
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => handleGenerateVideo(false)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerează ({VIDEO_REGENERATION_COST} tokenuri)
                  </Button>
                </div>
              </>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Se generează video-ul... Acest proces poate dura câteva minute.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmă Generarea</DialogTitle>
            <DialogDescription>
              {confirmAction === "generate" 
                ? "Vei folosi generarea gratuită cu watermark."
                : `Vei cheltui ${VIDEO_GENERATION_COST} tokenuri pentru a genera video-ul.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Anulează
            </Button>
            <Button onClick={() => confirmGenerateVideo(confirmAction === "generate")}>
              Confirmă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
