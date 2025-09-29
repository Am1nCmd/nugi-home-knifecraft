import { NextResponse } from "next/server"
import { addManyProducts } from "@/lib/store"
import { CATEGORIES, type ProductCategory } from "@/data/products"
import { cookies } from "next/headers"
import { getCookieName, verifySessionValue } from "@/lib/session"

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

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headerRaw = lines[0].split(",").map((s) => s.trim())
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
    const parts = lines[i].split(",").map((s) => s.trim())
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

    out.push({
      id: idx.id >= 0 ? parts[idx.id] : undefined,
      image: parts[idx.image],
      title: parts[idx.title],
      price,
      category,
      steel: parts[idx.steel],
      handleMaterial: parts[idx.handleMaterial],
      bladeLength,
      handleLength,
      bladeStyle: parts[idx.bladeStyle],
      handleStyle: parts[idx.handleStyle],
    })
  }
  return out
}

export async function POST(req: Request) {
  const session = verifySessionValue(cookies().get(getCookieName())?.value)
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File tidak ditemukan." }, { status: 400 })
  }
  const text = await file.text()
  const rows = parseCsv(text)
  if (!rows.length) {
    return NextResponse.json({ ok: false, error: "CSV tidak valid atau kosong." }, { status: 400 })
  }
  await addManyProducts(rows)
  return NextResponse.json({ ok: true, count: rows.length })
}
