import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { addManyProducts, getProducts } from "@/lib/store"
import { CATEGORIES, type ProductCategory, type Product } from "@/data/products"

function normalizeKey(k: string) {
  return k.toLowerCase().replace(/[\s\-_]/g, "")
}

type CsvRow = {
  id?: string
  image: string
  title: string
  price: number
  category: ProductCategory
  steel: string
  handleMaterial: string
  bladeLength: number
  handleLength: number
  bladeStyle: string
  handleStyle: string
}

function parseCsvWithQuotes(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  // Parse CSV properly handling quotes
  function parseCsvLine(line: string): string[] {
    const result = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"'
          i += 2
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
          i++
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
        i++
      } else {
        current += char
        i++
      }
    }
    result.push(current.trim())
    return result
  }

  const headerRaw = parseCsvLine(lines[0])
  const header = headerRaw.map(normalizeKey)

  // dukung EN/ID untuk kolom
  const mapIdx = (keys: string[]) =>
    keys
      .map(normalizeKey)
      .map((k) => header.indexOf(k))
      .find((i) => i >= 0) ?? -1

  const idx = {
    id: mapIdx(["id"]),
    image: mapIdx(["image", "photo", "foto", "gambar", "fotourl"]),
    title: mapIdx(["title", "judul", "nama"]),
    price: mapIdx(["price", "harga"]),
    category: mapIdx(["category", "kategori"]),
    steel: mapIdx(["steel", "bahanbaja"]),
    handleMaterial: mapIdx(["handlematerial", "bahangagang"]),
    bladeLength: mapIdx(["bladelength", "panjangbilah"]),
    handleLength: mapIdx(["handlelength", "panjanggagang"]),
    bladeStyle: mapIdx(["bladestyle", "modelbilah"]),
    handleStyle: mapIdx(["handlestyle", "modelgagang"]),
  }

  // image/title/price/category minimal harus ada
  if (
    [
      idx.image,
      idx.title,
      idx.price,
      idx.category,
      idx.steel,
      idx.handleMaterial,
      idx.bladeLength,
      idx.handleLength,
      idx.bladeStyle,
      idx.handleStyle,
    ].some((i) => i < 0)
  ) {
    return []
  }

  const out: CsvRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i])
    const category = parts[idx.category] as ProductCategory
    const price = Number(parts[idx.price] || "0")
    const bladeLength = Number(parts[idx.bladeLength] || "0")
    const handleLength = Number(parts[idx.handleLength] || "0")

    if (
      !parts[idx.title] ||
      !parts[idx.image] ||
      !CATEGORIES.includes(category) ||
      !Number.isFinite(price) ||
      !Number.isFinite(bladeLength) ||
      !Number.isFinite(handleLength) ||
      !parts[idx.steel] ||
      !parts[idx.handleMaterial] ||
      !parts[idx.bladeStyle] ||
      !parts[idx.handleStyle]
    ) {
      continue
    }

    // Remove quotes from string fields
    const cleanString = (str: string) => str.replace(/^["']|["']$/g, '')

    out.push({
      id: idx.id >= 0 ? cleanString(parts[idx.id]) : undefined,
      image: cleanString(parts[idx.image]),
      title: cleanString(parts[idx.title]),
      price,
      category,
      steel: cleanString(parts[idx.steel]),
      handleMaterial: cleanString(parts[idx.handleMaterial]),
      bladeLength,
      handleLength,
      bladeStyle: cleanString(parts[idx.bladeStyle]),
      handleStyle: cleanString(parts[idx.handleStyle]),
    })
  }
  return out
}

type ImportMode = "append" | "update" | "replace"

export async function POST(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await req.formData()
    const file = form.get("file")
    const mode = (form.get("mode") as ImportMode) || "append"

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 })
    }

    const text = await file.text()
    const rows = parseCsvWithQuotes(text)

    if (!rows.length) {
      return NextResponse.json({ error: "CSV tidak valid atau kosong." }, { status: 400 })
    }

    // Get existing products for merge logic
    const existingProducts = await getProducts()
    const existingIds = new Set(existingProducts.map(p => p.id))
    const existingTitles = new Set(existingProducts.map(p => p.title.toLowerCase()))

    let processedRows: Partial<Product>[] = []
    let stats = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[]
    }

    for (const row of rows) {
      try {
        // Generate ID if not provided
        if (!row.id || row.id.trim() === '') {
          row.id = "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        }

        switch (mode) {
          case "append":
            // Skip if ID or title already exists
            if (existingIds.has(row.id) || existingTitles.has(row.title.toLowerCase())) {
              stats.skipped++
              continue
            }
            processedRows.push(row)
            stats.added++
            break

          case "update":
            // Update if exists, add if new
            if (existingIds.has(row.id)) {
              stats.updated++
            } else {
              stats.added++
            }
            processedRows.push(row)
            break

          case "replace":
            // Add all rows (will replace entire dataset)
            processedRows.push(row)
            stats.added++
            break
        }
      } catch (error) {
        stats.errors.push(`Error processing row "${row.title}": ${error}`)
      }
    }

    // Handle replace mode
    if (mode === "replace") {
      // This would need a different store function to replace all
      // For now, we'll treat it as update mode
      await addManyProducts(processedRows)
    } else {
      await addManyProducts(processedRows)
    }

    return NextResponse.json({
      success: true,
      stats,
      message: `Import berhasil: ${stats.added} ditambah, ${stats.updated} diperbarui, ${stats.skipped} dilewati`
    })

  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat import" },
      { status: 500 }
    )
  }
}
