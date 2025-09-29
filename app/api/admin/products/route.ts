import { NextResponse } from "next/server"
import { addProduct } from "@/lib/store"
import { CATEGORIES, type Product } from "@/data/products"
import { cookies } from "next/headers"
import { getCookieName, verifySessionValue } from "@/lib/session"

export async function POST(req: Request) {
  const session = verifySessionValue(cookies().get(getCookieName())?.value)
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await req.json()) as Partial<Product> & {
      // izinkan kirim angka dalam string
      bladeLength?: number | string
      handleLength?: number | string
      price?: number | string
    }

    // koersi angka
    if (body.price !== undefined) body.price = Number(body.price)
    if (body.bladeLength !== undefined) body.bladeLength = Number(body.bladeLength)
    if (body.handleLength !== undefined) body.handleLength = Number(body.handleLength)

    if (
      !body?.title ||
      !Number.isFinite(body?.price as number) ||
      !body?.category ||
      !body?.image ||
      !body?.steel ||
      !body?.handleMaterial ||
      !Number.isFinite(body?.bladeLength as number) ||
      !Number.isFinite(body?.handleLength as number) ||
      !body?.bladeStyle ||
      !body?.handleStyle
    ) {
      return NextResponse.json({ ok: false, error: "Data tidak lengkap." }, { status: 400 })
    }
    if (!CATEGORIES.includes(body.category as any)) {
      return NextResponse.json({ ok: false, error: "Kategori tidak valid." }, { status: 400 })
    }

    await addProduct(body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 })
  }
}
