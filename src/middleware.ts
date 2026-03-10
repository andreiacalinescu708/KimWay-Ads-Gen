import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!req.nextauth.token?.isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow public paths
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/api/auth") ||
          req.nextUrl.pathname.startsWith("/auth")
        ) {
          return true
        }
        return token !== null
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/generate/:path*", "/admin/:path*"],
}
