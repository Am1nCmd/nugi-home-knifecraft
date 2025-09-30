"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Sword, ArrowLeft, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminArticleForm from "@/components/admin-article-form"
import AdminArticleList from "@/components/admin-article-list"

export default function AdminArticlesPage() {
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
                <div className="text-amber-400 text-sm font-medium">Article Management</div>
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
            <div className="p-3 bg-green-600/20 rounded-lg">
              <FileText className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Article Management</h1>
              <p className="text-zinc-300">Kelola artikel blog dan knowledge base</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 border-zinc-700/50">
            <TabsTrigger value="list" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Daftar Artikel
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Tambah Artikel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <AdminArticleList />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <AdminArticleForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}