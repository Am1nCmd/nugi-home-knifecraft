"use client"

import { useState } from "react"
import useSWR from "swr"
import KnivesFilters, { type KnivesFilterState } from "./filters"
import KnivesGrid from "./grid"
import type { UnifiedProduct } from "@/data/unified-products"
import { KNIFE_FILTER_META } from "@/data/knives"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function KnivesExplorer() {
  const { data, error, isLoading } = useSWR<UnifiedProduct[]>("/api/knives", fetcher, { revalidateOnFocus: true })

  const defaults: KnivesFilterState = {
    category: "all",
    steel: "all",
    handle: "all",
    price: [KNIFE_FILTER_META.price.min, KNIFE_FILTER_META.price.max],
    bladeLength: [KNIFE_FILTER_META.bladeLength.min, KNIFE_FILTER_META.bladeLength.max],
  }

  const [filters, setFilters] = useState<KnivesFilterState>(defaults)

  if (isLoading) return (
    <div className="text-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
      <p className="text-zinc-300 text-lg">Memuat produk...</p>
    </div>
  )
  if (error) return (
    <div className="text-center py-16">
      <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-6 h-6 bg-red-500 rounded-full"></div>
      </div>
      <p className="text-red-400 text-lg">Gagal memuat produk</p>
    </div>
  )

  const list = (data || []).filter((k) => {
    if (filters.category !== "all" && k.category !== filters.category) return false
    if (filters.steel !== "all" && k.steel !== filters.steel) return false
    if (filters.handle !== "all" && k.handleMaterial !== filters.handle) return false
    if (k.price < filters.price[0] || k.price > filters.price[1]) return false
    if (k.bladeLengthCm < filters.bladeLength[0] || k.bladeLengthCm > filters.bladeLength[1]) return false
    return true
  })

  return (
    <div className="space-y-6">
      <KnivesFilters
        state={filters}
        onChange={setFilters}
        steels={KNIFE_FILTER_META.steels}
        handles={KNIFE_FILTER_META.handles}
        priceRange={KNIFE_FILTER_META.price}
        bladeLengthRange={KNIFE_FILTER_META.bladeLength}
      />
      <KnivesGrid products={list} />
    </div>
  )
}
