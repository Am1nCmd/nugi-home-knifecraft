"use client"

import useSWR from "swr"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProductGrid({ category }: { category: string }) {
  const { data, error, isLoading } = useSWR<Product[]>("/api/products", fetcher, {
    revalidateOnFocus: true,
  })

  if (isLoading) return <p className="text-sm">Memuat produk...</p>
  if (error) return <p className="text-sm text-red-600">Gagal memuat produk</p>

  const list = (data || []).filter((p) => (category === "all" ? true : p.category === category))

  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground">Tidak ada produk pada kategori ini.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {list.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  )
}
