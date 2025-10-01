import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/store-production"
import { normalizeProduct, type UnifiedProduct } from "@/data/unified-products"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const maker = searchParams.get("maker") // Filter by maker email or name

    // Fetch all products from unified database
    const allProducts = await getProducts()

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

    // Maker filter (by email or name)
    if (maker && maker !== "all") {
      filteredProducts = filteredProducts.filter(product => {
        // Check both createdBy and updatedBy for maker match
        const createdByMatch = product.createdBy?.email === maker || product.createdBy?.name === maker
        const updatedByMatch = product.updatedBy?.email === maker || product.updatedBy?.name === maker
        return createdByMatch || updatedByMatch
      })
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
        case "maker":
          aVal = a.createdBy?.name || a.createdBy?.email || ""
          bVal = b.createdBy?.name || b.createdBy?.email || ""
          break
        case "created":
          aVal = new Date(a.createdAt || 0)
          bVal = new Date(b.createdAt || 0)
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
        maker,
        sortBy,
        sortOrder
      }
    })
  } catch (error) {
    console.error("Error fetching unified products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}