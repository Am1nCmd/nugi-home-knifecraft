"use client"

import useSWR from "swr"
import ToolsFilters, { type ToolsFilterState } from "./filters"
import ToolsGrid from "./grid"
import type { UnifiedProduct } from "@/data/unified-products"
import { TOOL_FILTER_META } from "@/data/tools"
import React from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ToolsExplorer() {
  const { data, error, isLoading } = useSWR<UnifiedProduct[]>("/api/tools", fetcher, { revalidateOnFocus: true })

  const defaults: ToolsFilterState = {
    category: "all",
    steel: "all",
    handle: "all",
    price: [TOOL_FILTER_META.price.min, TOOL_FILTER_META.price.max],
    bladeLength: [TOOL_FILTER_META.bladeLength.min, TOOL_FILTER_META.bladeLength.max],
  }

  const [filters, setFilters] = React.useState<ToolsFilterState>(defaults)

  if (isLoading) return <p className="text-sm">Memuat produk...</p>
  if (error) return <p className="text-sm text-red-600">Gagal memuat produk</p>

  const list = (data || []).filter((p) => {
    if (filters.category !== "all" && p.category !== filters.category) return false
    if (filters.steel !== "all" && p.steel !== filters.steel) return false
    if (filters.handle !== "all" && p.handleMaterial !== filters.handle) return false
    if (p.price < filters.price[0] || p.price > filters.price[1]) return false
    if (p.bladeLengthCm < filters.bladeLength[0] || p.bladeLengthCm > filters.bladeLength[1]) return false
    return true
  })

  return (
    <div className="space-y-6">
      <ToolsFilters
        state={filters}
        onChange={setFilters}
        steels={TOOL_FILTER_META.steels}
        handles={TOOL_FILTER_META.handles}
        priceRange={TOOL_FILTER_META.price}
        bladeLengthRange={TOOL_FILTER_META.bladeLength}
      />
      <ToolsGrid products={list} />
    </div>
  )
}
