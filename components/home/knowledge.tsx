"use client"

export function HomeKnowledge() {
  return (
    <section className="border-t border-zinc-700/50 bg-gradient-to-b from-zinc-800/30 to-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Ilmu <span className="text-amber-400">Pengetahuan</span>
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl mx-auto">
            Edukasi singkat tentang material dan proses pembuatan pisau berkualitas tinggi.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-700/50 bg-zinc-800/40 p-8 hover:bg-zinc-700/40 transition-colors duration-300">
            <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-amber-400 rounded-sm"></div>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-white mb-4">Baja</h3>
            <p className="text-zinc-300 leading-relaxed">
              Pemilihan baja memengaruhi ketajaman, ketahanan aus, dan kemudahan asah. Variasi komposisi (karbon,
              kromium, vanadium) dan metode pembuatan (forged vs stock removal) akan menentukan karakter bilah.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-700/50 bg-zinc-800/40 p-8 hover:bg-zinc-700/40 transition-colors duration-300">
            <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-amber-500 rounded-full"></div>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-white mb-4">Kayu</h3>
            <p className="text-zinc-300 leading-relaxed">
              Gagang kayu pilihan seperti walnut atau oak menghadirkan kenyamanan genggaman dan aksen natural. Perlakuan
              finishing yang tepat menjaga estetika dan keawetannya.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-700/50 bg-zinc-800/40 p-8 hover:bg-zinc-700/40 transition-colors duration-300">
            <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-600 rounded"></div>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-white mb-4">Heat Treatment</h3>
            <p className="text-zinc-300 leading-relaxed">
              Proses quench dan temper menentukan keseimbangan antara kekerasan dan ketangguhan. Prosedur yang akurat
              penting untuk performa optimal dan umur pakai yang panjang.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
