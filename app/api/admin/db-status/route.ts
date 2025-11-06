import { NextResponse } from "next/server"
import { getDatabaseInfo, getProducts } from "@/lib/store-production"

export async function GET() {
  try {
    const dbInfo = getDatabaseInfo()

    // Handle potential KV initialization errors
    let products: Awaited<ReturnType<typeof getProducts>> = []
    let productCount = 0
    let sampleProducts: Array<{
      id: string
      title: string
      price: number
      category: string
    }> = []

    try {
      products = await getProducts()
      productCount = products.length
      sampleProducts = products.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category
      }))
    } catch (dbError) {
      console.warn('Failed to fetch products:', dbError)
      // Return db info without product data if database fails
    }

    return NextResponse.json({
      success: true,
      databaseInfo: dbInfo,
      productCount,
      sampleProducts,
      ...(products.length === 0 && { warning: 'Could not fetch products from database' })
    })
  } catch (error) {
    console.error('Database status error:', error)
    return NextResponse.json({
      error: `Database status error: ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false
    }, { status: 500 })
  }
}