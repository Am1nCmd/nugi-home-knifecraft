import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { addManyProducts, getProducts } from "@/lib/store"
import { UnifiedProduct, ALL_CATEGORIES, KNIFE_CATEGORIES, TOOL_CATEGORIES } from "@/data/unified-products"

function normalizeKey(k: string) {
  return k.toLowerCase().replace(/[\s\-_]/g, "")
}

type CsvRow = {
  id?: string
  title: string
  price: number
  type?: string
  category: string
  images?: string[]
  image?: string // legacy compatibility
  steel: string
  handleMaterial: string
  bladeLengthCm: number
  handleLengthCm: number
  bladeThicknessMm?: number
  weightGr?: number
  bladeStyle: string
  handleStyle: string
  description?: string
  specs?: string // JSON string
  createdAt?: string
  updatedAt?: string
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
    title: mapIdx(["title", "judul", "nama"]),
    price: mapIdx(["price", "harga"]),
    type: mapIdx(["type", "producttype", "jenis"]),
    category: mapIdx(["category", "kategori"]),
    images: mapIdx(["images", "photos", "foto", "gambar"]),
    image: mapIdx(["image", "photo", "foto", "gambar", "fotourl"]), // legacy
    steel: mapIdx(["steel", "bahanbaja"]),
    handleMaterial: mapIdx(["handlematerial", "bahangagang"]),
    bladeLengthCm: mapIdx(["bladelengthcm", "bladelength", "panjangbilah"]),
    handleLengthCm: mapIdx(["handlelengthcm", "handlelength", "panjanggagang"]),
    bladeThicknessMm: mapIdx(["bladethicknessmm", "bladethickness", "ketebalanbilah"]),
    weightGr: mapIdx(["weightgr", "weight", "berat"]),
    bladeStyle: mapIdx(["bladestyle", "modelbilah"]),
    handleStyle: mapIdx(["handlestyle", "modelgagang"]),
    description: mapIdx(["description", "deskripsi", "desc"]),
    specs: mapIdx(["specs", "spesifikasi", "specifications"]),
    createdAt: mapIdx(["createdat", "created", "dibuat"]),
    updatedAt: mapIdx(["updatedat", "updated", "diperbarui"]),
  }

  // Required fields check - allow both new and legacy format
  const requiredFields = [idx.title, idx.price, idx.category, idx.steel, idx.handleMaterial, idx.bladeStyle, idx.handleStyle]
  const imageField = idx.images >= 0 ? idx.images : idx.image
  const bladeLengthField = idx.bladeLengthCm >= 0 ? idx.bladeLengthCm : -1
  const handleLengthField = idx.handleLengthCm >= 0 ? idx.handleLengthCm : -1

  if (requiredFields.some((i) => i < 0) || imageField < 0 || bladeLengthField < 0 || handleLengthField < 0) {
    return []
  }

  const out: CsvRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i])

    // Get values
    const category = parts[idx.category]
    const type = parts[idx.type] || (KNIFE_CATEGORIES.includes(category as any) ? "knife" : TOOL_CATEGORIES.includes(category as any) ? "tool" : "knife")
    const price = Number(parts[idx.price] || "0")
    const bladeLengthCm = Number(parts[bladeLengthField] || "0")
    const handleLengthCm = Number(parts[handleLengthField] || "0")
    const bladeThicknessMm = idx.bladeThicknessMm >= 0 ? Number(parts[idx.bladeThicknessMm] || "0") : undefined
    const weightGr = idx.weightGr >= 0 ? Number(parts[idx.weightGr] || "0") : undefined

    // Validation
    if (
      !parts[idx.title] ||
      !parts[imageField] ||
      !ALL_CATEGORIES.includes(category as any) ||
      !Number.isFinite(price) ||
      !Number.isFinite(bladeLengthCm) ||
      !Number.isFinite(handleLengthCm) ||
      !parts[idx.steel] ||
      !parts[idx.handleMaterial] ||
      !parts[idx.bladeStyle] ||
      !parts[idx.handleStyle]
    ) {
      continue
    }

    // Helper to clean string values
    const cleanString = (str: string) => str?.replace(/^["']|["']$/g, '') || ''

    // Parse images
    let images: string[] = []
    if (idx.images >= 0 && parts[idx.images]) {
      images = parts[idx.images].split(';').map(cleanString).filter(Boolean)
    } else if (idx.image >= 0 && parts[idx.image]) {
      images = [cleanString(parts[idx.image])]
    }

    // Parse specs
    let specs: any = undefined
    if (idx.specs >= 0 && parts[idx.specs]) {
      try {
        specs = JSON.parse(cleanString(parts[idx.specs]))
      } catch {
        // If not valid JSON, ignore
      }
    }

    out.push({
      id: idx.id >= 0 ? cleanString(parts[idx.id]) : undefined,
      title: cleanString(parts[idx.title]),
      price,
      type: type as "knife" | "tool",
      category,
      images,
      steel: cleanString(parts[idx.steel]),
      handleMaterial: cleanString(parts[idx.handleMaterial]),
      bladeLengthCm,
      handleLengthCm,
      bladeThicknessMm,
      weightGr,
      bladeStyle: cleanString(parts[idx.bladeStyle]),
      handleStyle: cleanString(parts[idx.handleStyle]),
      description: idx.description >= 0 ? cleanString(parts[idx.description]) : undefined,
      specs,
      createdAt: idx.createdAt >= 0 ? cleanString(parts[idx.createdAt]) : undefined,
      updatedAt: idx.updatedAt >= 0 ? cleanString(parts[idx.updatedAt]) : undefined,
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

    let processedRows: Partial<UnifiedProduct>[] = []
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

        // Convert CsvRow to UnifiedProduct format
        const unifiedProduct: Partial<UnifiedProduct> = {
          id: row.id,
          title: row.title,
          price: row.price,
          type: row.type as "knife" | "tool",
          category: row.category as any,
          images: row.images || [],
          steel: row.steel,
          handleMaterial: row.handleMaterial,
          bladeLengthCm: row.bladeLengthCm,
          handleLengthCm: row.handleLengthCm,
          bladeThicknessMm: row.bladeThicknessMm,
          weightGr: row.weightGr,
          bladeStyle: row.bladeStyle,
          handleStyle: row.handleStyle,
          description: row.description,
          specs: row.specs,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        }

        switch (mode) {
          case "append":
            // Skip if ID or title already exists
            if (existingIds.has(row.id) || existingTitles.has(row.title.toLowerCase())) {
              stats.skipped++
              continue
            }
            processedRows.push(unifiedProduct)
            stats.added++
            break

          case "update":
            // Update if exists, add if new
            if (existingIds.has(row.id)) {
              stats.updated++
            } else {
              stats.added++
            }
            processedRows.push(unifiedProduct)
            break

          case "replace":
            // Add all rows (will replace entire dataset)
            processedRows.push(unifiedProduct)
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
