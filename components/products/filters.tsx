"use client"

import { useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ALL_CATEGORIES, KNIFE_CATEGORIES, TOOL_CATEGORIES } from "@/data/unified-products"
import type { ProductType } from "@/data/unified-products"

export type ProductsFilterState = {
  type: "all" | ProductType
  category: "all" | string
  search: string
  steel: "all" | string
  handle: "all" | string
  price: [number, number]
  bladeLength: [number, number]
  sortBy: "price" | "title" | "category"
  sortOrder: "asc" | "desc"
}

export default function ProductsFilters({
  state,
  onChange,
  steels,
  handles,
  priceRange,
  bladeLengthRange,
}: {
  state: ProductsFilterState
  onChange: (next: ProductsFilterState) => void
  steels: string[]
  handles: string[]
  priceRange: { min: number; max: number }
  bladeLengthRange: { min: number; max: number }
}) {
  const priceMarks = useMemo(() => [priceRange.min, priceRange.max], [priceRange.min, priceRange.max])
  const bladeMarks = useMemo(
    () => [bladeLengthRange.min, bladeLengthRange.max],
    [bladeLengthRange.min, bladeLengthRange.max],
  )

  // Get available categories based on type filter
  const availableCategories = useMemo(() => {
    if (state.type === "knife") return KNIFE_CATEGORIES
    if (state.type === "tool") return TOOL_CATEGORIES
    return ALL_CATEGORIES
  }, [state.type])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Cari produk..."
          value={state.search}
          onChange={(e) => onChange({ ...state, search: e.target.value })}
          className="pl-10 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400"
        />
      </div>

      {/* Main Filters Grid */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 md:grid-cols-6">
        {/* Product Type */}
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-300">Tipe Produk</Label>
          <Select
            value={state.type}
            onValueChange={(v) => onChange({ ...state, type: v as ProductsFilterState["type"], category: "all" })}
          >
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
              <SelectValue placeholder="Semua produk" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="knife">Pisau</SelectItem>
              <SelectItem value="tool">Tools</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-300">Kategori</Label>
          <Select
            value={state.category}
            onValueChange={(v) => onChange({ ...state, category: v })}
          >
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Steel */}
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-300">Bahan (Baja)</Label>
          <Select value={state.steel} onValueChange={(v) => onChange({ ...state, steel: v })}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
              <SelectValue placeholder="Semua baja" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua</SelectItem>
              {steels.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Handle Material */}
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-300">Bahan (Gagang)</Label>
          <Select value={state.handle} onValueChange={(v) => onChange({ ...state, handle: v })}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
              <SelectValue placeholder="Semua bahan gagang" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua</SelectItem>
              {handles.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-300">Urutkan</Label>
          <Select value={state.sortBy} onValueChange={(v) => onChange({ ...state, sortBy: v as ProductsFilterState["sortBy"] })}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="price">Harga</SelectItem>
              <SelectItem value="title">Nama</SelectItem>
              <SelectItem value="category">Kategori</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-300">Urutan</Label>
          <Select value={state.sortOrder} onValueChange={(v) => onChange({ ...state, sortOrder: v as ProductsFilterState["sortOrder"] })}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="asc">Terendah</SelectItem>
              <SelectItem value="desc">Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Range Filters */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Price Range */}
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4">
          <Label className="text-zinc-300">Harga (Rp)</Label>
          <Slider
            value={state.price}
            min={priceRange.min}
            max={priceRange.max}
            step={10000}
            onValueChange={(v) => onChange({ ...state, price: v as [number, number] })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Rp {state.price[0].toLocaleString("id-ID")}</span>
            <span>Rp {state.price[1].toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Blade Length Range */}
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4">
          <Label className="text-zinc-300">Panjang Bilah (cm)</Label>
          <Slider
            value={state.bladeLength}
            min={bladeLengthRange.min}
            max={bladeLengthRange.max}
            step={0.5}
            onValueChange={(v) => onChange({ ...state, bladeLength: v as [number, number] })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{state.bladeLength[0]} cm</span>
            <span>{state.bladeLength[1]} cm</span>
          </div>
        </div>
      </div>
    </div>
  )
}