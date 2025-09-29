import Link from "next/link"
import { Sword, ArrowLeft } from "lucide-react"
import AdminLoginForm from "@/components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900">
      <div className="absolute inset-0 bg-[url('/metal-texture.jpg')] opacity-5 bg-cover"></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Website
        </Link>
      </header>

      <main className="relative z-10 flex items-center justify-center px-6 pb-12">
        <section className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-lg">
              <Sword className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <div className="font-serif text-2xl font-bold text-white">Nugi Home</div>
              <div className="text-amber-400 text-sm font-medium">Knifecraft</div>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-white mb-2">Panel Admin</h1>
              <p className="text-zinc-300">Silakan login untuk melanjutkan ke dashboard.</p>
            </div>
            <AdminLoginForm />
          </div>
        </section>
      </main>
    </div>
  )
}
