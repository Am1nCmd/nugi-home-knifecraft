import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Read current database
    const dbPath = path.join(process.cwd(), "data", "products.db.json")
    let products = []

    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8")
      const db = JSON.parse(data)
      products = db.products || []
    }

    // Convert to CSV format
    const headers = [
      "id",
      "title",
      "price",
      "category",
      "image",
      "steel",
      "handleMaterial",
      "bladeLength",
      "handleLength",
      "bladeStyle",
      "handleStyle",
      "createdAt"
    ]

    // Create CSV content
    let csvContent = headers.join(",") + "\n"

    // Add existing products
    products.forEach((product: any) => {
      const row = [
        product.id || "",
        `"${(product.title || "").replace(/"/g, '""')}"`, // Escape quotes
        product.price || "",
        product.category || "",
        product.image || "",
        product.steel || "",
        product.handleMaterial || "",
        product.bladeLength || "",
        product.handleLength || "",
        product.bladeStyle || "",
        product.handleStyle || "",
        product.createdAt || new Date().toISOString()
      ]
      csvContent += row.join(",") + "\n"
    })

    // Add example rows if database is empty
    if (products.length === 0) {
      const examples = [
        [
          "",
          '"Pisau Chef Damascus Premium"',
          "850000",
          "Kitchen",
          "/images/chef-damascus.jpg",
          "Damascus Steel",
          "Pakka Wood",
          "20",
          "12",
          "Chef Knife",
          "Ergonomic",
          new Date().toISOString()
        ],
        [
          "",
          '"Tactical Survival Knife"',
          "450000",
          "Tactical",
          "/images/tactical-survival.jpg",
          "D2 Steel",
          "G10",
          "15",
          "11",
          "Drop Point",
          "Textured Grip",
          new Date().toISOString()
        ]
      ]

      examples.forEach(row => {
        csvContent += row.join(",") + "\n"
      })
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `nugi-home-products-${timestamp}.csv`

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Gagal mengekspor data produk" },
      { status: 500 }
    )
  }
}