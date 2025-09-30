import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import dynamic from "next/dynamic"

const ProductsExplorer = dynamic(() => import("@/components/products/explorer"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-zinc-900">Loading...</div>
})

export const metadata: Metadata = {
  title: "Products - Nugi Home Knifecraft",
  description: "Jelajahi katalog lengkap pisau dan tools: Tactical, Bushcraft, Kitchen, Butcher, Axe, Machete, dan Swords dengan filter lengkap.",
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
        <header className="space-y-4 py-8">
          <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight text-white">
            Katalog <span className="text-amber-400">Produk</span>
          </h1>
          <p className="text-pretty text-lg text-zinc-300 max-w-3xl leading-relaxed">
            Temukan koleksi lengkap pisau dan tools berkualitas tinggi. Mulai dari pisau Tactical, Bushcraft, Kitchen, Butcher hingga Axe, Machete, dan Swords. Gunakan filter untuk menyaring pilihan sesuai kebutuhan Anda.
          </p>
        </header>

        <ProductsExplorer />
      </main>
      <Footer />
    </div>
  )
}