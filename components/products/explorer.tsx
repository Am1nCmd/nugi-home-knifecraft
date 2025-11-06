"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import useSWR from "swr"
import ProductsFilters, { type ProductsFilterState } from "./filters"
import ProductsGrid from "./grid"
import type { UnifiedProduct } from "@/data/unified-products"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Helper function to build query params
function buildQueryString(filters: ProductsFilterState) {
  const params = new URLSearchParams()

  if (filters.type !== "all") params.set("type", filters.type)
  if (filters.category !== "all") params.set("category", filters.category)
  if (filters.search) params.set("search", filters.search)
  if (filters.steel !== "all") params.set("steel", filters.steel)
  if (filters.handle !== "all") params.set("handle", filters.handle)
  if (filters.maker !== "all") params.set("maker", filters.maker)
  if (filters.sortBy !== "price") params.set("sortBy", filters.sortBy)
  if (filters.sortOrder !== "asc") params.set("sortOrder", filters.sortOrder)

  return params.toString()
}

export default function ProductsExplorer() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize filter state from URL params or defaults
  const defaults: ProductsFilterState = {
    type: (searchParams.get("type") as "all" | "knife" | "tool") || "all",
    category: searchParams.get("category") || "all",
    search: searchParams.get("search") || "",
    steel: "all",
    handle: "all",
    maker: searchParams.get("maker") || "all",
    price: [50000, 2000000], // Will be updated from API metadata
    bladeLength: [5, 50],    // Will be updated from API metadata
    sortBy: (searchParams.get("sortBy") as "price" | "title" | "category") || "price",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc"
  }

  const [filters, setFilters] = useState<ProductsFilterState>(defaults)

  // Build API URL with filters
  const apiUrl = useMemo(() => {
    const query = buildQueryString(filters)
    return `/api/products/unified${query ? `?${query}` : ""}`
  }, [filters])

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000
  })

  // Update URL when filters change
  useEffect(() => {
    const query = buildQueryString(filters)
    const newUrl = `/products${query ? `?${query}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [filters, router])

  // Extract metadata for filters
  const filterMetadata = useMemo(() => {
    if (!data?.products) {
      return {
        steels: [],
        handles: [],
        makers: [],
        priceRange: { min: 50000, max: 2000000 },
        bladeLengthRange: { min: 5, max: 50 }
      }
    }

    const products = data.products as UnifiedProduct[]
    const steels = [...new Set(products.map(p => p.steel))].filter(Boolean).sort()
    const handles = [...new Set(products.map(p => p.handleMaterial))].filter(Boolean).sort()

    // Extract unique makers from products
    const makers = [...new Set(
      products.flatMap(p => [
        p.createdBy?.name,
        p.updatedBy?.name
      ]).filter((name): name is string => Boolean(name))
    )].sort()

    const prices = products.map(p => p.price).filter(p => p > 0)
    const bladeLengths = products.map(p => p.bladeLengthCm).filter(l => l > 0)

    return {
      steels,
      handles,
      makers,
      priceRange: {
        min: Math.min(...prices, 50000),
        max: Math.max(...prices, 2000000)
      },
      bladeLengthRange: {
        min: Math.min(...bladeLengths, 5),
        max: Math.max(...bladeLengths, 50)
      }
    }
  }, [data])

  // Update price and blade length ranges when metadata changes
  useEffect(() => {
    if (filterMetadata.priceRange.min !== filters.price[0] || filterMetadata.priceRange.max !== filters.price[1]) {
      setFilters(prev => ({
        ...prev,
        price: [filterMetadata.priceRange.min, filterMetadata.priceRange.max],
        bladeLength: [filterMetadata.bladeLengthRange.min, filterMetadata.bladeLengthRange.max]
      }))
    }
  }, [filterMetadata]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 bg-red-500 rounded-full"></div>
        </div>
        <p className="text-red-400 text-lg">Gagal memuat produk</p>
        <p className="text-zinc-500 text-sm mt-2">Silakan coba lagi nanti</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ProductsFilters
        state={filters}
        onChange={setFilters}
        steels={filterMetadata.steels}
        handles={filterMetadata.handles}
        makers={filterMetadata.makers}
        priceRange={filterMetadata.priceRange}
        bladeLengthRange={filterMetadata.bladeLengthRange}
      />

      <ProductsGrid
        products={data?.products || []}
        isLoading={isLoading}
      />
    </div>
  )
}