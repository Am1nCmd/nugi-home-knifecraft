"use client"

import useSWR from "swr"
import KnivesFilters, { type KnivesFilterState } from "./filters"
import KnivesGrid from "./grid"
import type { KnifeProduct } from "@/data/knives"
import { KNIFE_FILTER_META } from "@/data/knives"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function KnivesExplorer() {
  const { data, error, isLoading } = useSWR<KnifeProduct[]>("/api/knives", fetcher, { revalidateOnFocus: true })

  const defaults: KnivesFilterState = {
    category: "all",
    steel: "all",
    handle: "all",
    price: [KNIFE_FILTER_META.price.min, KNIFE_FILTER_META.price.max],
    bladeLength: [KNIFE_FILTER_META.bladeLength.min, KNIFE_FILTER_META.bladeLength.max],
  }

  // local state kept minimal by URL-less controlled components; for simplicity, use a simple React state
  const stateRef = { current: defaults }
  // a small hack to force rerender with useState would be typical, but Next.js supports client hooks normally.
  // We'll use React.useState here.
  const [filters, setFilters] = require("react").useState<KnivesFilterState>(defaults)

  if (isLoading) return <p className="text-sm">Memuat produk...</p>
  if (error) return <p className="text-sm text-red-600">Gagal memuat produk</p>

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
