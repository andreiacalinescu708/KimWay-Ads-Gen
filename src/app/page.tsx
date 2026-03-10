import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Video, Zap, Shield, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Generează reclame video
              <span className="text-primary"> cu AI</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Creează reclame video profesionale pentru produsele și serviciile tale 
              în câteva minute. Introdu descrierea, primești scriptul, generezi video-ul.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/generate">
                <Button size="lg" className="text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Începe Gratuit
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-lg">
                  Vezi Prețuri
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Prima generare este gratuită cu watermark
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Cum funcționează
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Trei pași simpli pentru a crea reclama ta video
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Descrie Produsul</h3>
              <p className="text-center text-gray-600">
                Introdu numele și descrierea produsului sau serviciului tău
              </p>
            </div>
            <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Primești Scriptul</h3>
              <p className="text-center text-gray-600">
                AI-ul generează un script profesional de reclamă pe care îl poți edita
              </p>
            </div>
            <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white mb-4">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Generează Video</h3>
              <p className="text-center text-gray-600">
                Transformă scriptul într-un video profesional gata de publicare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Prețuri Simple
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Plătești doar pentru ce folosești
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold">Generare Gratuită</h3>
              <p className="mt-2 text-3xl font-bold">0€</p>
              <p className="text-muted-foreground">O singură dată</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  1 video cu watermark
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Script generat de AI
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-6 border-primary">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pachet Starter</h3>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Popular</span>
              </div>
              <p className="mt-2 text-3xl font-bold">9.99€</p>
              <p className="text-muted-foreground">50 tokenuri</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ~5 video-uri
                </li>
                  <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Fără watermark
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Regenerare disponibilă
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold">Pachet Pro</h3>
              <p className="mt-2 text-3xl font-bold">24.99€</p>
              <p className="text-muted-foreground">150 tokenuri</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ~15 video-uri
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Fără watermark
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Suport prioritar
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="outline">Vezi Toate Pachetele</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Gata să începi?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Creează prima ta reclamă video gratuită acum
          </p>
          <div className="mt-8">
            <Link href="/generate">
              <Button size="lg" variant="secondary" className="text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Generează Reclama Ta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
