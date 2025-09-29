import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ToolsExplorer from "@/components/tools/explorer"

export const metadata = {
  title: "Tools - Nugi Home Knifecraft",
  description: "Jelajahi koleksi tools berkualitas: Axe, Machete, dan Swords untuk berbagai kebutuhan.",
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-balance text-white">
            Katalog <span className="text-amber-400">Tools</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-3xl leading-relaxed">
            Jelajahi Axe, Machete, dan Swords berkualitas tinggi untuk berbagai kebutuhan outdoor dan profesional.
          </p>
        </header>
        <ToolsExplorer />
      </main>
      <Footer />
    </div>
  )
}
