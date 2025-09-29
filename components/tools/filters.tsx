"use client"

import { useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { ToolCategory } from "@/data/tools"

export type ToolsFilterState = {
  category: "all" | ToolCategory
  steel: "all" | string
  handle: "all" | string
  price: [number, number]
  bladeLength: [number, number]
}

export default function ToolsFilters({
  state,
  onChange,
  steels,
  handles,
  priceRange,
  bladeLengthRange,
}: {
  state: ToolsFilterState
  onChange: (next: ToolsFilterState) => void
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

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 md:grid-cols-5">
      {/* Jenis */}
      <div className="flex flex-col gap-2">
        <Label>Jenis</Label>
        <Select
          value={state.category}
          onValueChange={(v) => onChange({ ...state, category: v as ToolsFilterState["category"] })}
        >
          <SelectTrigger aria-label="Pilih jenis alat">
            <SelectValue placeholder="Semua jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Axe">Axe</SelectItem>
            <SelectItem value="Machete">Machete</SelectItem>
            <SelectItem value="Swords">Swords</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bahan Baja */}
      <div className="flex flex-col gap-2">
        <Label>Bahan (Baja)</Label>
        <Select value={state.steel} onValueChange={(v) => onChange({ ...state, steel: v as any })}>
          <SelectTrigger aria-label="Pilih baja">
            <SelectValue placeholder="Semua baja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {steels.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bahan Gagang */}
      <div className="flex flex-col gap-2">
        <Label>Bahan (Gagang)</Label>
        <Select value={state.handle} onValueChange={(v) => onChange({ ...state, handle: v as any })}>
          <SelectTrigger aria-label="Pilih bahan gagang">
            <SelectValue placeholder="Semua bahan gagang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {handles.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Harga */}
      <div className="flex flex-col gap-2">
        <Label>Harga</Label>
        <Slider
          value={state.price}
          min={priceRange.min}
          max={priceRange.max}
          step={10000}
          onValueChange={(v) => onChange({ ...state, price: v as [number, number] })}
        />
        <div className="text-xs text-muted-foreground">
          Rp {priceMarks[0].toLocaleString("id-ID")} - Rp {priceMarks[1].toLocaleString("id-ID")}
        </div>
      </div>

      {/* Panjang Bilah */}
      <div className="flex flex-col gap-2">
        <Label>Panjang Bilah (cm)</Label>
        <Slider
          value={state.bladeLength}
          min={bladeLengthRange.min}
          max={bladeLengthRange.max}
          step={0.5}
          onValueChange={(v) => onChange({ ...state, bladeLength: v as [number, number] })}
        />
        <div className="text-xs text-muted-foreground">
          {bladeMarks[0]} - {bladeMarks[1]} cm
        </div>
      </div>
    </div>
  )
}
