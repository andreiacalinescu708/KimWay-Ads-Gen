"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, Chrome } from "lucide-react"

interface SignInButtonProps {
  provider: "google" | "github"
}

export function SignInButton({ provider }: SignInButtonProps) {
  const handleSignIn = () => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  const icons = {
    google: <Chrome className="mr-2 h-4 w-4" />,
    github: <Github className="mr-2 h-4 w-4" />,
  }

  const labels = {
    google: "Continuă cu Google",
    github: "Continuă cu GitHub",
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleSignIn}
    >
      {icons[provider]}
      {labels[provider]}
    </Button>
  )
}
