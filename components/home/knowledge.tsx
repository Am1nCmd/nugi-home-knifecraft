"use client"

export function HomeKnowledge() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-6">
          <h2 className="font-serif text-2xl md:text-3xl">Ilmu Pengetahuan</h2>
          <p className="text-muted-foreground leading-relaxed">
            Edukasi singkat tentang material dan proses pembuatan pisau.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-serif text-lg">Baja</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pemilihan baja memengaruhi ketajaman, ketahanan aus, dan kemudahan asah. Variasi komposisi (karbon,
              kromium, vanadium) dan metode pembuatan (forged vs stock removal) akan menentukan karakter bilah.
            </p>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-serif text-lg">Kayu</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gagang kayu pilihan seperti walnut atau oak menghadirkan kenyamanan genggaman dan aksen natural. Perlakuan
              finishing yang tepat menjaga estetika dan keawetannya.
            </p>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-serif text-lg">Heat Treatment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Proses quench dan temper menentukan keseimbangan antara kekerasan dan ketangguhan. Prosedur yang akurat
              penting untuk performa optimal dan umur pakai yang panjang.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
