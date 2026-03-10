import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SignInButton } from "@/components/auth/signin-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bun venit la Kimiway Ads</CardTitle>
          <CardDescription>
            Conectează-te pentru a genera reclame video profesionale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInButton provider="google" />
          <SignInButton provider="github" />
          <p className="text-center text-xs text-muted-foreground mt-4">
            Prin conectare, ești de acord cu Termenii și Condițiile
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
