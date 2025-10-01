import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { addProduct, updateProduct, deleteProduct, getProductById, isReadOnlyMode, getDatabaseInfo } from "@/lib/store-production"
import { ALL_CATEGORIES, type UnifiedProduct } from "@/data/unified-products"

export async function POST(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json()) as Partial<UnifiedProduct> & {
      // Support both old and new field names for backward compatibility
      bladeLength?: number | string
      handleLength?: number | string
      bladeLengthCm?: number | string
      handleLengthCm?: number | string
      bladeThicknessMm?: number | string
      weightGr?: number | string
      price?: number | string
      image?: string // Legacy single image support
      images?: string[] // New multi-image support
    }

    // Auto-capture maker information from session
    const makerInfo = {
      email: session.user.email!,
      name: session.user.name || session.user.email!
    }

    // Convert string numbers to actual numbers
    if (body.price !== undefined) body.price = Number(body.price)
    if (body.bladeLengthCm !== undefined) body.bladeLengthCm = Number(body.bladeLengthCm)
    if (body.handleLengthCm !== undefined) body.handleLengthCm = Number(body.handleLengthCm)
    if (body.bladeThicknessMm !== undefined && body.bladeThicknessMm !== "") {
      body.bladeThicknessMm = Number(body.bladeThicknessMm)
    }
    if (body.weightGr !== undefined && body.weightGr !== "") {
      body.weightGr = Number(body.weightGr)
    }

    // Support legacy field names
    if (body.bladeLength !== undefined) body.bladeLengthCm = Number(body.bladeLength)
    if (body.handleLength !== undefined) body.handleLengthCm = Number(body.handleLength)

    // Handle image/images compatibility
    let images: string[] = []
    if (body.images && Array.isArray(body.images)) {
      images = body.images.filter(Boolean) // Remove empty strings
    } else if (body.image) {
      images = [body.image]
    }

    // Detailed validation with specific error messages
    const missingFields: string[] = []

    if (!body?.title?.trim()) missingFields.push("Judul")
    if (!Number.isFinite(body?.price as number) || (body.price as number) <= 0) missingFields.push("Harga (harus berupa angka positif)")
    if (!body?.category?.trim()) missingFields.push("Kategori")
    if (images.length === 0) missingFields.push("Foto Produk (upload file atau masukkan URL)")
    if (!body?.steel?.trim()) missingFields.push("Bahan Baja")
    if (!body?.handleMaterial?.trim()) missingFields.push("Bahan Gagang")
    if (!Number.isFinite(body?.bladeLengthCm as number) || (body.bladeLengthCm as number) <= 0) missingFields.push("Panjang Bilah (harus berupa angka positif)")
    if (!Number.isFinite(body?.handleLengthCm as number) || (body.handleLengthCm as number) <= 0) missingFields.push("Panjang Gagang (harus berupa angka positif)")
    if (!body?.bladeStyle?.trim()) missingFields.push("Model Bilah")
    if (!body?.handleStyle?.trim()) missingFields.push("Model Gagang")

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Data tidak lengkap. Field yang kurang: ${missingFields.join(", ")}`
      }, { status: 400 })
    }

    // Validate category
    if (!ALL_CATEGORIES.includes(body.category as any)) {
      return NextResponse.json({
        error: `Kategori tidak valid. Pilih salah satu: ${ALL_CATEGORIES.join(", ")}`
      }, { status: 400 })
    }

    // Create unified product object
    const productData: Partial<UnifiedProduct> = {
      ...body,
      images,
      createdBy: makerInfo,
      updatedBy: makerInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await addProduct(productData)

    const dbInfo = getDatabaseInfo()
    const response = {
      success: true,
      message: `Produk "${body.title}" berhasil ditambahkan oleh ${makerInfo.name}`,
      ...(dbInfo.isReadOnly && {
        warning: "⚠️ Running in read-only mode. Changes are temporary and will be lost on restart."
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Add product error:", error)
    return NextResponse.json({
      error: `Gagal menambahkan produk: ${error instanceof Error ? error.message : "Error tidak dikenal"}`
    }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json()) as Partial<UnifiedProduct> & {
      id: string
      bladeLength?: number | string
      handleLength?: number | string
      bladeLengthCm?: number | string
      handleLengthCm?: number | string
      bladeThicknessMm?: number | string
      weightGr?: number | string
      price?: number | string
      image?: string
      images?: string[]
    }

    if (!body.id) {
      return NextResponse.json({ error: "ID produk diperlukan untuk update" }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await getProductById(body.id)
    if (!existingProduct) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }

    // Auto-capture updater information from session
    const updaterInfo = {
      email: session.user.email!,
      name: session.user.name || session.user.email!
    }

    // Convert string numbers to actual numbers
    if (body.price !== undefined) body.price = Number(body.price)
    if (body.bladeLengthCm !== undefined) body.bladeLengthCm = Number(body.bladeLengthCm)
    if (body.handleLengthCm !== undefined) body.handleLengthCm = Number(body.handleLengthCm)
    if (body.bladeThicknessMm !== undefined && body.bladeThicknessMm !== "") {
      body.bladeThicknessMm = Number(body.bladeThicknessMm)
    }
    if (body.weightGr !== undefined && body.weightGr !== "") {
      body.weightGr = Number(body.weightGr)
    }

    // Support legacy field names
    if (body.bladeLength !== undefined) body.bladeLengthCm = Number(body.bladeLength)
    if (body.handleLength !== undefined) body.handleLengthCm = Number(body.handleLength)

    // Handle image/images compatibility
    let images: string[] = []
    if (body.images && Array.isArray(body.images)) {
      images = body.images.filter(Boolean)
    } else if (body.image) {
      images = [body.image]
    }

    // Detailed validation with specific error messages
    const missingFields: string[] = []

    if (!body?.title?.trim()) missingFields.push("Judul")
    if (!Number.isFinite(body?.price as number) || (body.price as number) <= 0) missingFields.push("Harga (harus berupa angka positif)")
    if (!body?.category?.trim()) missingFields.push("Kategori")
    if (images.length === 0) missingFields.push("Foto Produk (upload file atau masukkan URL)")
    if (!body?.steel?.trim()) missingFields.push("Bahan Baja")
    if (!body?.handleMaterial?.trim()) missingFields.push("Bahan Gagang")
    if (!Number.isFinite(body?.bladeLengthCm as number) || (body.bladeLengthCm as number) <= 0) missingFields.push("Panjang Bilah (harus berupa angka positif)")
    if (!Number.isFinite(body?.handleLengthCm as number) || (body.handleLengthCm as number) <= 0) missingFields.push("Panjang Gagang (harus berupa angka positif)")
    if (!body?.bladeStyle?.trim()) missingFields.push("Model Bilah")
    if (!body?.handleStyle?.trim()) missingFields.push("Model Gagang")

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Data tidak lengkap. Field yang kurang: ${missingFields.join(", ")}`
      }, { status: 400 })
    }

    // Validate category
    if (!ALL_CATEGORIES.includes(body.category as any)) {
      return NextResponse.json({
        error: `Kategori tidak valid. Pilih salah satu: ${ALL_CATEGORIES.join(", ")}`
      }, { status: 400 })
    }

    // Create update data
    const updateData: Partial<UnifiedProduct> = {
      ...body,
      images,
      updatedBy: updaterInfo
    }

    const updatedProduct = await updateProduct(body.id, updateData)

    const dbInfo = getDatabaseInfo()
    const response = {
      success: true,
      message: `Produk "${body.title}" berhasil diupdate oleh ${updaterInfo.name}`,
      product: updatedProduct,
      ...(dbInfo.isReadOnly && {
        warning: "⚠️ Running in read-only mode. Changes are temporary and will be lost on restart."
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({
      error: `Gagal mengupdate produk: ${error instanceof Error ? error.message : "Error tidak dikenal"}`
    }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID produk diperlukan" }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await getProductById(id)
    if (!existingProduct) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }

    const success = await deleteProduct(id)

    if (!success) {
      return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 })
    }

    const dbInfo = getDatabaseInfo()
    const response = {
      success: true,
      message: `Produk "${existingProduct.title}" berhasil dihapus`,
      ...(dbInfo.isReadOnly && {
        warning: "⚠️ Running in read-only mode. Changes are temporary and will be lost on restart."
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({
      error: `Gagal menghapus produk: ${error instanceof Error ? error.message : "Error tidak dikenal"}`
    }, { status: 500 })
  }
}
