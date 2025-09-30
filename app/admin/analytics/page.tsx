"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Sword, ArrowLeft, BarChart3, TrendingUp, Users, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
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

  const stats = [
    {
      title: "Total Kunjungan",
      value: "12,543",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Produk Dilihat",
      value: "8,432",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-green-400"
    },
    {
      title: "Konversi",
      value: "3.4%",
      change: "+0.8%",
      icon: TrendingUp,
      color: "text-amber-400"
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
                <div className="text-amber-400 text-sm font-medium">Analytics</div>
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
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="text-zinc-300">Monitor performa website dan engagement</p>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-300">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-green-400">
                    {stat.change} dari bulan lalu
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon */}
        <Card className="bg-zinc-800/50 border-zinc-700/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Fitur analytics sedang dalam pengembangan. Akan segera hadir dengan visualisasi data yang lengkap.
            </p>
            <div className="text-sm text-zinc-500">
              Coming soon...
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}