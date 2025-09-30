"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { UnifiedProduct, ALL_CATEGORIES, KNIFE_CATEGORIES, TOOL_CATEGORIES, ProductType } from "@/data/unified-products"
import { Loader2, Save, X } from "lucide-react"

interface ProductEditModalProps {
  product: UnifiedProduct | null
  isOpen: boolean
  onClose: () => void
  onSave?: (updatedProduct: UnifiedProduct) => void
}

export default function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<string>("")
  const [type, setType] = useState<ProductType>("knife")
  const [category, setCategory] = useState<string>("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [steel, setSteel] = useState("")
  const [handleMaterial, setHandleMaterial] = useState("")
  const [bladeLengthCm, setBladeLengthCm] = useState<string>("")
  const [handleLengthCm, setHandleLengthCm] = useState<string>("")
  const [bladeThicknessMm, setBladeThicknessMm] = useState<string>("")
  const [weightGr, setWeightGr] = useState<string>("")
  const [bladeStyle, setBladeStyle] = useState("")
  const [handleStyle, setHandleStyle] = useState("")
  const [description, setDescription] = useState("")

  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Initialize form with product data
  useEffect(() => {
    if (product && isOpen) {
      setTitle(product.title || "")
      setPrice(product.price?.toString() || "")
      setType(product.type || "knife")
      setCategory(product.category || "")
      setImageUrl(product.images?.[0] || "")
      setImageFile(null)

      setSteel(product.steel || "")
      setHandleMaterial(product.handleMaterial || "")
      setBladeLengthCm(product.bladeLengthCm?.toString() || "")
      setHandleLengthCm(product.handleLengthCm?.toString() || "")
      setBladeThicknessMm(product.bladeThicknessMm?.toString() || "")
      setWeightGr(product.weightGr?.toString() || "")
      setBladeStyle(product.bladeStyle || "")
      setHandleStyle(product.handleStyle || "")
      setDescription(product.description || "")
      setMsg(null)
    }
  }, [product, isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMsg(null)
      setImageFile(null)
    }
  }, [isOpen])

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return

    setMsg(null)
    setLoading(true)

    try {
      let image = imageUrl.trim()
      if (imageFile) {
        image = await fileToDataUrl(imageFile)
      }

      const updateData = {
        id: product.id,
        title,
        price: Number(price),
        type,
        category,
        images: [image],
        steel,
        handleMaterial,
        bladeLengthCm: Number(bladeLengthCm),
        handleLengthCm: Number(handleLengthCm),
        bladeThicknessMm: bladeThicknessMm ? Number(bladeThicknessMm) : undefined,
        weightGr: weightGr ? Number(weightGr) : undefined,
        bladeStyle,
        handleStyle,
        description: description || undefined,
      }

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setMsg(data?.error || "Gagal mengupdate produk.")
      } else {
        setMsg(data?.message || "Produk berhasil diupdate.")

        // Call onSave callback with updated product
        if (onSave && data?.product) {
          onSave(data.product)
        }

        // Close modal after successful update
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch {
      setMsg("Terjadi kesalahan jaringan.")
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-800 border-zinc-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl">Edit Produk</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Edit informasi produk: {product.title}
              </DialogDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-zinc-200">Judul</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pisau Baru"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price" className="text-zinc-200">Harga</Label>
              <Input
                id="edit-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                inputMode="numeric"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-200">Tipe Produk</Label>
              <Select value={type} onValueChange={(value: ProductType) => {
                setType(value)
                setCategory("") // Reset category when type changes
              }}>
                <SelectTrigger className="bg-zinc-700/50 border-zinc-600/50 text-white">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="knife">Knife (Pisau)</SelectItem>
                  <SelectItem value="tool">Tool (Alat)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-200">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-zinc-700/50 border-zinc-600/50 text-white">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {(type === "knife" ? KNIFE_CATEGORIES : TOOL_CATEGORIES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-steel" className="text-zinc-200">Bahan Baja</Label>
              <Input
                id="edit-steel"
                value={steel}
                onChange={(e) => setSteel(e.target.value)}
                placeholder="D2 / AUS-8 / ..."
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-handleMaterial" className="text-zinc-200">Bahan Gagang</Label>
              <Input
                id="edit-handleMaterial"
                value={handleMaterial}
                onChange={(e) => setHandleMaterial(e.target.value)}
                placeholder="G10 / Kayu / ..."
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-bladeLengthCm" className="text-zinc-200">Panjang Bilah (cm)</Label>
              <Input
                id="edit-bladeLengthCm"
                value={bladeLengthCm}
                onChange={(e) => setBladeLengthCm(e.target.value)}
                placeholder="10"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                inputMode="numeric"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-handleLengthCm" className="text-zinc-200">Panjang Gagang (cm)</Label>
              <Input
                id="edit-handleLengthCm"
                value={handleLengthCm}
                onChange={(e) => setHandleLengthCm(e.target.value)}
                placeholder="12"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                inputMode="numeric"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-bladeThicknessMm" className="text-zinc-200">Ketebalan Bilah (mm)</Label>
              <Input
                id="edit-bladeThicknessMm"
                value={bladeThicknessMm}
                onChange={(e) => setBladeThicknessMm(e.target.value)}
                placeholder="3.5"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                inputMode="numeric"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-weightGr" className="text-zinc-200">Berat (gr)</Label>
              <Input
                id="edit-weightGr"
                value={weightGr}
                onChange={(e) => setWeightGr(e.target.value)}
                placeholder="200"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                inputMode="numeric"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-bladeStyle" className="text-zinc-200">Model Bilah</Label>
              <Input
                id="edit-bladeStyle"
                value={bladeStyle}
                onChange={(e) => setBladeStyle(e.target.value)}
                placeholder="Drop Point / Tanto / ..."
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-handleStyle" className="text-zinc-200">Model Gagang</Label>
              <Input
                id="edit-handleStyle"
                value={handleStyle}
                onChange={(e) => setHandleStyle(e.target.value)}
                placeholder="Ergonomic / Slim / ..."
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description" className="text-zinc-200">Deskripsi (Opsional)</Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat produk..."
              className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-200">Foto Produk</Label>
            <div className="space-y-3">
              {/* Current image preview */}
              {imageUrl && !imageFile && (
                <div className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg border border-zinc-600/50">
                  <img
                    src={imageUrl}
                    alt="Current"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="text-sm text-zinc-300">Foto saat ini</div>
                    <div className="text-xs text-zinc-500">Upload file baru untuk mengganti</div>
                  </div>
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="bg-zinc-700/50 border-zinc-600/50 text-white"
              />
              <div className="text-xs text-zinc-400">Atau masukkan URL gambar</div>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/pisau-premium-di-atas-meja-kayu.jpg atau https://..."
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
            <div className="flex-1">
              {msg && (
                <p className={`text-sm ${msg.includes("berhasil") ? "text-green-400" : "text-red-400"}`}>
                  {msg}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}