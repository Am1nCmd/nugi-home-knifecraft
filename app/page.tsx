"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
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
      <section id="katalog" className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-balance text-2xl md:text-3xl font-semibold">Katalog Pisau</h2>
          <CategoryFilter categories={["Semua", ...CATEGORIES]} value={category} onChange={setCategory} />
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Memuat produk...</p>
        ) : displayedProducts.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada produk untuk kategori ini.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <HomeNews />
      <HomeKnowledge />
    </main>
  )
}
