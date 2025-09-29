"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Text content */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-balance md:text-5xl">
              Pisau Handmade Premium untuk Dapur, Alam, dan Taktikal
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Kualitas baja terpilih, gagang kayu pilihan, dan proses heat treatment presisi. Temukan keseimbangan
              antara estetika dan performa pada setiap bilah.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
                <Link href="#detail">Lihat Detail</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <Link href="#beli">Beli Sekarang</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/pisau-handmade-premium-close-up-product-photo-on-d.jpg"
              alt="Pisau handmade terbaru - close-up"
              className="h-auto w-full rounded-xl border border-border object-cover shadow"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
