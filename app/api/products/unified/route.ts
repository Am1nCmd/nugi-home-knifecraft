import { NextRequest, NextResponse } from "next/server"
import { getKnives } from "@/lib/store"
import { getTools } from "@/lib/store"
import { normalizeProduct, type UnifiedProduct } from "@/data/unified-products"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryFilter = searchParams.get("category")
    const typeFilter = searchParams.get("type") // "knife" | "tool" | "all"
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const steel = searchParams.get("steel")
    const handle = searchParams.get("handle")

    // Fetch both knives and tools
    const [knives, tools] = await Promise.all([
      getKnives(),
      getTools()
    ])

    // Normalize and combine all products
    const allProducts: UnifiedProduct[] = [
      ...knives.map(normalizeProduct),
      ...tools.map(normalizeProduct)
    ]

    // Apply filters
    let filteredProducts = allProducts

    // Type filter (knife/tool/all)
    if (typeFilter && typeFilter !== "all") {
      filteredProducts = filteredProducts.filter(product => product.type === typeFilter)
    }

    // Category filter (specific category like "Tactical", "Axe", etc.)
    if (categoryFilter && categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(product => product.category === categoryFilter)
    }

    // Search filter (title and description)
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      )
    }

    // Price range filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseInt(minPrice))
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseInt(maxPrice))
    }

    // Steel filter
    if (steel && steel !== "all") {
      filteredProducts = filteredProducts.filter(product => product.steel === steel)
    }

    // Handle material filter
    if (handle && handle !== "all") {
      filteredProducts = filteredProducts.filter(product => product.handleMaterial === handle)
    }

    // Sort by price (ascending by default)
    const sortBy = searchParams.get("sortBy") || "price"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    filteredProducts.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case "price":
          aVal = a.price
          bVal = b.price
          break
        case "title":
          aVal = a.title
          bVal = b.title
          break
        case "category":
          aVal = a.category
          bVal = b.category
          break
        default:
          aVal = a.price
          bVal = b.price
      }

      if (sortOrder === "desc") {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      }
    })

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      filters: {
        category: categoryFilter,
        type: typeFilter,
        search,
        minPrice,
        maxPrice,
        steel,
        handle,
        sortBy,
        sortOrder
      }
    })
  } catch (error) {
    console.error("Error fetching unified products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}