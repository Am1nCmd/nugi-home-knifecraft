"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomeHero } from "@/components/home/hero"
import { HomeCategories } from "@/components/home/categories"
import { HomeNews } from "@/components/home/news"
import { HomeKnowledge } from "@/components/home/knowledge"
import { CategoryFilter } from "@/components/category-filter"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ALL_CATEGORIES, type UnifiedProduct } from "@/data/unified-products"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HomePage() {
  const [category, setCategory] = useState<string>("Semua")

  const { data: knivesData, isLoading: knivesLoading } = useSWR<UnifiedProduct[]>("/api/knives", fetcher)
  const { data: toolsData, isLoading: toolsLoading } = useSWR<UnifiedProduct[]>("/api/tools", fetcher)

  const knives = knivesData ?? []
  const tools = toolsData ?? []
  const products = [...knives, ...tools]
  const isLoading = knivesLoading || toolsLoading

  const displayedProducts = useMemo(() => {
    let filteredProducts = products

    // Filter by category if not "Semua"
    if (category !== "Semua") {
      filteredProducts = products.filter((p) => p.category === category)
    }

    // Sort by ID (assuming higher ID = newer) and limit to 9 items
    return filteredProducts
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 9)
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
                Katalog <span className="text-amber-400">Terbaru</span>
              </h2>
              <p className="text-zinc-300">9 produk terbaru dari koleksi pisau dan tools berkualitas tinggi</p>
            </div>
            <CategoryFilter categories={["Semua", ...ALL_CATEGORIES]} value={category} onChange={setCategory} />
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProducts.map((product: UnifiedProduct) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Navigation buttons to full catalogs */}
              <div className="mt-12 pt-8 border-t border-zinc-700/50">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Ingin melihat koleksi lengkap?</h3>
                    <p className="text-zinc-400">Jelajahi seluruh katalog pisau dan tools kami</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-medium flex-1">
                      <Link href="/products?type=knife">
                        Lihat Semua Pisau
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-zinc-900 font-medium flex-1">
                      <Link href="/products?type=tool">
                        Lihat Semua Tools
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <HomeNews />
      <HomeKnowledge />
      <Footer />
    </main>
  )
}
