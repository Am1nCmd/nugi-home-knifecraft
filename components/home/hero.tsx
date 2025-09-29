"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900 text-white">
      <div className="absolute inset-0 bg-[url('/wood-grain-dark.jpg')] opacity-10 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Text content */}
          <div className="space-y-8">
            <h1 className="font-serif text-4xl font-bold leading-tight text-balance md:text-6xl bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Pisau Handmade Premium
            </h1>
            <h2 className="text-xl md:text-2xl text-amber-200 font-medium">
              untuk Dapur, Alam, dan Taktikal
            </h2>
            <p className="text-zinc-200 leading-relaxed text-lg">
              Kualitas baja terpilih, gagang kayu pilihan, dan proses heat treatment presisi.
              Temukan keseimbangan antara estetika dan performa pada setiap bilah yang kami ciptakan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-full shadow-lg">
                <Link href="#katalog">Lihat Katalog</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-zinc-900 px-8 py-6 text-lg rounded-full"
              >
                <Link href="/about">Tentang Kami</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-zinc-800 to-amber-900 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/hero-knife-premium.jpg"
                alt="Pisau handmade premium - craftsmanship detail"
                className="h-full w-full object-cover opacity-90"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-400 rounded-full opacity-20"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
