export function Hero() {
  return (
    <section id="home" className="relative">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src="/pisau-premium-di-atas-meja-kayu.jpg"
            alt="Pisau premium di atas meja kayu"
            className="h-[320px] md:h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="p-6 md:p-10">
              <h1 className="text-pretty text-3xl md:text-5xl font-semibold leading-tight">
                Pisau Premium untuk Segala Kebutuhan
              </h1>
              <p className="mt-3 md:mt-4 max-w-2xl text-muted-foreground">
                Temukan koleksi pisau Outdoor, Dapur, Survival, dan Koleksi dengan kualitas terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
