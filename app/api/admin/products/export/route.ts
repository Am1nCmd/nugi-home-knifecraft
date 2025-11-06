import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProducts } from "@/lib/store-production"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all products from unified database
    const products = await getProducts()

    // Convert to CSV format with unified structure
    const headers = [
      "id",
      "title",
      "price",
      "type",
      "category",
      "images",
      "steel",
      "handleMaterial",
      "bladeLengthCm",
      "handleLengthCm",
      "bladeThicknessMm",
      "weightGr",
      "bladeStyle",
      "handleStyle",
      "description",
      "specs",
      "createdAt",
      "updatedAt",
      "createdByName",
      "createdByEmail",
      "updatedByName",
      "updatedByEmail"
    ]

    // Create CSV content
    let csvContent = headers.join(",") + "\n"

    // Add all products from unified database
    products.forEach((product) => {
      // Helper function to escape CSV values
      const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) return ""
        const str = String(value)
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      const row = [
        product.id || "",
        escapeCSV(product.title),
        product.price || "",
        product.type || "",
        product.category || "",
        escapeCSV(Array.isArray(product.images) ? product.images.join(";") : ""),
        escapeCSV(product.steel),
        escapeCSV(product.handleMaterial),
        product.bladeLengthCm || "",
        product.handleLengthCm || "",
        product.bladeThicknessMm || "",
        product.weightGr || "",
        escapeCSV(product.bladeStyle),
        escapeCSV(product.handleStyle),
        escapeCSV(product.description),
        escapeCSV(product.specs ? JSON.stringify(product.specs) : ""),
        product.createdAt || "",
        product.updatedAt || "",
        escapeCSV(product.createdBy?.name || ""),
        escapeCSV(product.createdBy?.email || ""),
        escapeCSV(product.updatedBy?.name || ""),
        escapeCSV(product.updatedBy?.email || "")
      ]
      csvContent += row.join(",") + "\n"
    })

    // Add example rows if database is empty
    if (products.length === 0) {
      const timestamp = new Date().toISOString()
      const examples = [
        [
          "",
          '"Pisau Chef Damascus Premium"',
          "850000",
          "knife",
          "Kitchen",
          "/images/chef-damascus.jpg",
          "Damascus Steel",
          "Pakka Wood",
          "20",
          "12",
          "2.5",
          "250",
          "Chef Knife",
          "Ergonomic",
          "Premium Damascus steel chef knife",
          '{"Finishing":"Hand-forged","Origin":"Japan"}',
          timestamp,
          timestamp,
          "Admin User",
          "admin@example.com",
          "Admin User",
          "admin@example.com"
        ],
        [
          "",
          '"Forest Axe Medium"',
          "820000",
          "tool",
          "Axe",
          "/images/forest-axe.jpg",
          "1055 Carbon Steel",
          "Hickory Wood",
          "11",
          "50",
          "6",
          "950",
          "Bearded",
          "Curved",
          "Medium forest axe for camping",
          '{"Head":"Drop-forged","Sheath":"Leather"}',
          timestamp,
          timestamp,
          "Admin User",
          "admin@example.com",
          "Admin User",
          "admin@example.com"
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