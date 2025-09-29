"use client"

type Article = {
  title: string
  excerpt: string
  img: string
}

const articles: Article[] = [
  {
    title: "Tren Desain Pisau 2025",
    excerpt: "Eksplorasi bentuk bilah modern, profil bevel, dan finishing yang menggabungkan performa serta estetika.",
    img: "/knife-design-trend-editorial.jpg",
  },
  {
    title: "Event Komunitas Knife-Making",
    excerpt: "Bertemu para pembuat pisau lokal, berbagi teknik heat treatment, dan uji performa di lapangan.",
    img: "/knife-maker-community-event.jpg",
  },
  {
    title: "Tips Perawatan & Asah",
    excerpt: "Panduan step-by-step untuk mempertahankan ketajaman dan mencegah karat pada pisau kesayangan Anda.",
    img: "/knife-maintenance-sharpening-guide.jpg",
  },
]

export function HomeNews() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl">Berita tentang Pisau</h2>
          <p className="text-muted-foreground leading-relaxed">
            Update terbaru seputar tren, event, dan tips perawatan.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <article key={a.title} className="overflow-hidden rounded-lg border border-border bg-card">
              <img src={a.img || "/placeholder.svg"} alt={a.title} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h3 className="font-serif text-lg">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
