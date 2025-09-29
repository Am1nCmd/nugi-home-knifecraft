import type { Metadata } from "next"
import KnivesExplorer from "@/components/knives/explorer"

export const metadata: Metadata = {
  title: "Knives - Katalog Pisau",
  description: "Jelajahi katalog pisau: Tactical, Bushcraft, Kitchen, Butcher dengan filter lengkap.",
}

export default function Page() {
  return (
    <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">Katalog Pisau</h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Temukan pisau Tactical, Bushcraft, Kitchen, dan Butcher. Gunakan filter untuk menyaring pilihan sesuai
          kebutuhan Anda.
        </p>
      </header>

      <KnivesExplorer />
    </main>
  )
}
