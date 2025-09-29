"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Sword, ArrowLeft, LogOut, User } from "lucide-react"
import AdminProductForm from "@/components/admin-product-form"
import CsvUpload from "@/components/csv-upload"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

      <main className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-zinc-300">Kelola produk pisau dan tools untuk website Nugi Home Knifecraft.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Add Product Section */}
          <AdminProductForm />

          {/* CSV Upload Section */}
          <CsvUpload />
        </div>
      </main>
    </div>
  )
}
