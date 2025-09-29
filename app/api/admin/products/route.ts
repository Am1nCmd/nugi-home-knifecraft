import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { addProduct } from "@/lib/store"
import { CATEGORIES, type Product } from "@/data/products"

export async function POST(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 })
    }
    if (!CATEGORIES.includes(body.category as any)) {
      return NextResponse.json({ error: "Kategori tidak valid." }, { status: 400 })
    }

    await addProduct(body)
    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan"
    })
  } catch (error) {
    console.error("Add product error:", error)
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 })
  }
}
