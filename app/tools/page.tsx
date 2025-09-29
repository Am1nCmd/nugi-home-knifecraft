import ToolsExplorer from "@/components/tools/explorer"

export const metadata = {
  title: "Tools - Katalog",
}

export default function ToolsPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-balance">Tools</h1>
        <p className="text-sm text-muted-foreground">Jelajahi Axe, Machete, dan Swords.</p>
      </header>
      <ToolsExplorer />
    </main>
  )
}
