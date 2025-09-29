import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
      // Check if user has admin privileges
      if (!req.nextauth.token?.isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For admin routes, require authentication
        if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
          return !!token && !!token.isAdmin
        }

        // For admin login page, allow both authenticated and unauthenticated users
        if (req.nextUrl.pathname.startsWith("/admin/login")) {
          return true
        }

        // For all other routes, allow access
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/login"
  ]
}