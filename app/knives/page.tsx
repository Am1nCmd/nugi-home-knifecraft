import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import KnivesExplorer from "@/components/knives/explorer"

export const metadata: Metadata = {
  title: "Knives - Nugi Home Knifecraft",
  description: "Jelajahi katalog pisau: Tactical, Bushcraft, Kitchen, Butcher dengan filter lengkap.",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
        <header className="space-y-4 py-8">
          <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight text-white">
            Katalog <span className="text-amber-400">Pisau</span>
          </h1>
          <p className="text-pretty text-lg text-zinc-300 max-w-3xl leading-relaxed">
            Temukan pisau Tactical, Bushcraft, Kitchen, dan Butcher berkualitas tinggi. Gunakan filter untuk menyaring pilihan sesuai
            kebutuhan Anda.
          </p>
        </header>

        <KnivesExplorer />
      </main>
      <Footer />
    </div>
  )
}
