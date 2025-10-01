import { NextResponse } from "next/server"
import { getDatabaseInfo, getProducts } from "@/lib/store-production"

export async function GET() {
  try {
    const dbInfo = getDatabaseInfo()
    const products = await getProducts()

    return NextResponse.json({
      success: true,
      databaseInfo: dbInfo,
      productCount: products.length,
      sampleProducts: products.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category
      }))
    })
  } catch (error) {
    return NextResponse.json({
      error: `Database status error: ${error instanceof Error ? error.message : "Unknown error"}`
    }, { status: 500 })
  }
}