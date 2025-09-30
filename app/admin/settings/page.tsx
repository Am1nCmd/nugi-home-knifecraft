"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Sword, ArrowLeft, Settings, User, Database, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.isAdmin) {
      router.push("/admin/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  const settingSections = [
    {
      title: "User Management",
      description: "Kelola admin users dan permissions",
      icon: User,
      color: "bg-blue-600/20 text-blue-400"
    },
    {
      title: "Database Backup",
      description: "Backup dan restore data",
      icon: Database,
      color: "bg-green-600/20 text-green-400"
    },
    {
      title: "Security Settings",
      description: "Pengaturan keamanan sistem",
      icon: Shield,
      color: "bg-red-600/20 text-red-400"
    }
  ]

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Admin Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-lg">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="font-serif text-xl font-bold text-white">Nugi Home</span>
                <div className="text-amber-400 text-sm font-medium">Settings</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Kembali ke Dashboard</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <Settings className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-zinc-300">Konfigurasi sistem dan pengaturan admin</p>
            </div>
          </div>
        </header>

        {/* Current Admin Info */}
        <Card className="bg-zinc-800/50 border-zinc-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Current Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Admin"}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="text-white font-medium">{session.user.name}</p>
                <p className="text-zinc-400 text-sm">{session.user.email}</p>
                <p className="text-amber-400 text-xs">Administrator</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${section.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{section.title}</h3>
                      <p className="text-zinc-400 text-sm">{section.description}</p>
                    </div>
                  </div>
                  <div className="text-zinc-500 text-sm">
                    Coming soon...
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* System Info */}
        <Card className="mt-8 bg-zinc-800/50 border-zinc-700/50">
          <CardHeader>
            <CardTitle className="text-white">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-zinc-400 text-sm">Environment Variables</p>
                <div className="mt-2 space-y-1">
                  <p className="text-zinc-300 text-sm">
                    <span className="text-zinc-500">NEXTAUTH_SECRET:</span> {process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Not set"}
                  </p>
                  <p className="text-zinc-300 text-sm">
                    <span className="text-zinc-500">GOOGLE_CLIENT_ID:</span> {process.env.GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Not set"}
                  </p>
                  <p className="text-zinc-300 text-sm">
                    <span className="text-zinc-500">ADMIN_EMAILS:</span> {process.env.ADMIN_EMAILS ? "✓ Set" : "✗ Not set"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Admin Features</p>
                <div className="mt-2 space-y-1">
                  <p className="text-zinc-300 text-sm">✓ Product Management</p>
                  <p className="text-zinc-300 text-sm">✓ Article Management</p>
                  <p className="text-zinc-300 text-sm">✓ CSV Import/Export</p>
                  <p className="text-zinc-300 text-sm">○ Analytics (Coming Soon)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}