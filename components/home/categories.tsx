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
    <section className="border-t border-zinc-700/50 bg-zinc-800/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-10 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Kategori <span className="text-amber-400">Pisau</span>
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Pilih kategori yang sesuai kebutuhan Anda, dari dapur hingga aktivitas outdoor.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((c) => (
            <article
              key={c.title}
              className="group overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-900/20"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={c.img || "/placeholder.svg"}
                  alt={`Ilustrasi ${c.title}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-white group-hover:text-amber-400 transition-colors duration-300">
                  {c.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
