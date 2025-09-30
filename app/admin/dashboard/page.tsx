"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Sword, ArrowLeft, LogOut, User, Package, FileText, BarChart3, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Fetch statistics
  const { data: productsData } = useSWR("/api/products/unified", fetcher)
  const { data: articlesData } = useSWR("/api/articles", fetcher)

  const productCount = productsData?.products?.length || 0
  const knifeCount = productsData?.products?.filter((p: any) => p.type === "knife")?.length || 0
  const toolCount = productsData?.products?.filter((p: any) => p.type === "tool")?.length || 0
  const articleCount = articlesData?.articles?.length || 0

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session?.user?.isAdmin) {
      router.push("/admin/login")
    }
  }, [session, status, router])

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null // Will redirect via useEffect
  }

  const managementSections = [
    {
      title: "Product Management",
      description: "Kelola produk pisau dan tools",
      icon: Package,
      href: "/admin/products",
      stats: `${productCount} total (${knifeCount} pisau, ${toolCount} tools)`,
      color: "from-blue-600 to-blue-800"
    },
    {
      title: "Article Management",
      description: "Kelola artikel blog dan knowledge",
      icon: FileText,
      href: "/admin/articles",
      stats: `${articleCount} artikel`,
      color: "from-green-600 to-green-800"
    },
    {
      title: "Analytics",
      description: "Lihat statistik dan laporan",
      icon: BarChart3,
      href: "/admin/analytics",
      stats: "Performance data",
      color: "from-purple-600 to-purple-800"
    },
    {
      title: "Settings",
      description: "Pengaturan sistem dan user",
      icon: Settings,
      href: "/admin/settings",
      stats: "System configuration",
      color: "from-orange-600 to-orange-800"
    }
  ]

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Admin Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-lg">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="font-serif text-xl font-bold text-white">Nugi Home</span>
                <div className="text-amber-400 text-sm font-medium">Admin Panel</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              {/* User Profile */}
              <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/50 rounded-lg">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Admin"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">{session.user.name}</p>
                  <p className="text-zinc-400 text-xs">{session.user.email}</p>
                </div>
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Kembali ke Website</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-zinc-300">Selamat datang di panel admin Nugi Home Knifecraft. Pilih section yang ingin Anda kelola.</p>
        </header>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{productCount}</p>
                  <p className="text-zinc-400 text-sm">Total Produk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{articleCount}</p>
                  <p className="text-zinc-400 text-sm">Artikel</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-600/20 rounded-lg">
                  <Sword className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{knifeCount}</p>
                  <p className="text-zinc-400 text-sm">Pisau</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{toolCount}</p>
                  <p className="text-zinc-400 text-sm">Tools</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {managementSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.href} className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-br ${section.color} rounded-lg shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl">{section.title}</CardTitle>
                      <p className="text-zinc-400 text-sm mt-1">{section.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-zinc-300 text-sm mb-4">{section.stats}</p>
                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium">
                    <Link href={section.href}>
                      Kelola {section.title.split(' ')[0]}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-zinc-800/50 border-zinc-700/50">
          <CardHeader>
            <CardTitle className="text-white">Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">Dashboard telah diperbarui dengan sistem produk unified.</p>
            <p className="text-zinc-500 text-sm mt-2">Gunakan navigation di atas untuk mengakses management tools.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
