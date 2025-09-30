"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UnifiedProduct } from "@/data/unified-products"
import { X, User, Calendar, Edit } from "lucide-react"

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

interface ProductPreviewModalProps {
  product: UnifiedProduct | null
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
}

export default function ProductPreviewModal({ product, isOpen, onClose, onEdit }: ProductPreviewModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-800 border-zinc-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl">{product.title}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Preview detail produk
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEdit}
                  className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Foto Produk</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900/50">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-medium">Informasi Dasar</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      product.type === "knife"
                        ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                        : "bg-green-600/20 text-green-400 border-green-600/30"
                    }
                  >
                    {product.type === "knife" ? "Pisau" : "Tools"}
                  </Badge>
                  <Badge variant="outline" className="border-amber-600/30 bg-amber-600/10 text-amber-400">
                    {product.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Harga:</span>
                    <span className="text-white font-bold text-lg">{formatPriceIDR(product.price)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">ID Produk:</span>
                    <span className="text-zinc-300 font-mono text-sm">{product.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-medium">Spesifikasi</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Bahan Baja:</span>
                  <span className="text-zinc-300">{product.steel}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">Bahan Gagang:</span>
                  <span className="text-zinc-300">{product.handleMaterial}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">Panjang Bilah:</span>
                  <span className="text-zinc-300">{product.bladeLengthCm} cm</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">Panjang Gagang:</span>
                  <span className="text-zinc-300">{product.handleLengthCm} cm</span>
                </div>

                {product.bladeThicknessMm && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Ketebalan Bilah:</span>
                    <span className="text-zinc-300">{product.bladeThicknessMm} mm</span>
                  </div>
                )}

                {product.weightGr && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Berat:</span>
                    <span className="text-zinc-300">{product.weightGr} gr</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-400">Model Bilah:</span>
                  <span className="text-zinc-300">{product.bladeStyle}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">Model Gagang:</span>
                  <span className="text-zinc-300">{product.handleStyle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Deskripsi</h3>
              <p className="text-zinc-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Additional Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Spesifikasi Tambahan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-zinc-300">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-zinc-700/50 space-y-4">
            <h3 className="text-white font-medium">Informasi Metadata</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Created Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Dibuat</span>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="text-zinc-300 text-sm">
                    {product.createdAt ? new Date(product.createdAt).toLocaleString("id-ID") : "Tidak diketahui"}
                  </div>
                  {product.createdBy && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <User className="w-3 h-3" />
                      <span>{product.createdBy.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Updated Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Terakhir Diupdate</span>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="text-zinc-300 text-sm">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleString("id-ID") : "Tidak diketahui"}
                  </div>
                  {product.updatedBy && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <User className="w-3 h-3" />
                      <span>{product.updatedBy.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}