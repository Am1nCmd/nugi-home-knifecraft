"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error from NextAuth
    const authError = searchParams.get('error')
    if (authError === 'AccessDenied') {
      setError('Access denied. Only authorized admin emails can access this panel.')
    }

    // Redirect if already logged in as admin
    if (session?.user?.isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [session, router, searchParams])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('google', {
        callbackUrl: '/admin/dashboard',
        redirect: false
      })

      if (result?.error) {
        if (result.error === 'AccessDenied') {
          setError('Access denied. Only authorized admin emails can access this panel.')
        } else {
          setError('Login failed. Please try again.')
        }
      }
    } catch (err) {
      setError('An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        size="lg"
        className="w-full bg-white hover:bg-gray-50 text-zinc-900 border border-zinc-300 font-medium py-6 text-lg"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-900"></div>
            Signing in...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </div>
        )}
      </Button>

      <div className="text-center text-zinc-400 text-sm">
        <p>Only authorized admin emails can access this panel</p>
        <p className="mt-1 text-xs">
          Authorized: nug198@gmail.com, am1n.aenurahman@gmail.com
        </p>
      </div>
    </div>
  )
}
