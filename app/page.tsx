"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomeHero } from "@/components/home/hero"
import { HomeCategories } from "@/components/home/categories"
import { HomeNews } from "@/components/home/news"
import { HomeKnowledge } from "@/components/home/knowledge"
import { CategoryFilter } from "@/components/category-filter"
import { ProductCard } from "@/components/product-card"
import { CATEGORIES, type Product } from "@/data/products"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HomePage() {
  const [category, setCategory] = useState<string>("Semua")

  const { data, isLoading } = useSWR<{ products: Product[] }>("/api/products", fetcher)
  const products = data?.products ?? []

  const displayedProducts = useMemo(() => {
    if (category === "Semua") return products
    return products.filter((p) => p.category === category)
  }, [category, products])

  return (
    <main>
      <Header />
      <HomeHero />
      <HomeCategories />
      <section id="katalog" className="bg-zinc-800/30 border-t border-zinc-700/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-balance text-3xl md:text-4xl font-bold text-white mb-2">
                Katalog <span className="text-amber-400">Pisau</span>
              </h2>
              <p className="text-zinc-300">Temukan pisau berkualitas tinggi sesuai kebutuhan Anda</p>
            </div>
            <CategoryFilter categories={["Semua", ...CATEGORIES]} value={category} onChange={setCategory} />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-zinc-300">Memuat produk...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">Tidak ada produk untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <HomeNews />
      <HomeKnowledge />
      <Footer />
    </main>
  )
}
