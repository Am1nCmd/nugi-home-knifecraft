"use client"

const categories = [
  {
    title: "Kitchen Knife",
    img: "/kitchen-knife-on-cutting-board-dark-background.jpg",
  },
  {
    title: "Butcher Knife",
    img: "/butcher-knife-heavy-duty-dark-background.jpg",
  },
  {
    title: "Bushcraft Knife",
    img: "/bushcraft-knife-outdoors-wood-texture.jpg",
  },
  {
    title: "Tactical Knife",
    img: "/tactical-knife-matte-black-metal.jpg",
  },
]

export function HomeCategories() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl">Kategori Pisau</h2>
          <p className="text-muted-foreground leading-relaxed">Pilih kategori yang sesuai kebutuhan Anda.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((c) => (
            <article key={c.title} className="group overflow-hidden rounded-lg border border-border">
              <div className="aspect-[3/2] overflow-hidden bg-muted">
                <img
                  src={c.img || "/placeholder.svg"}
                  alt={`Ilustrasi ${c.title}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg">{c.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
