import ProductCard from "./product-card"
import type { UnifiedProduct } from "@/data/unified-products"

export default function ProductsGrid({
  products,
  isLoading = false
}: {
  products: UnifiedProduct[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-zinc-800/50 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-800/50 rounded w-1/2"></div>
              <div className="h-4 bg-zinc-800/50 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-amber-400/50 rounded-full"></div>
        </div>
        <p className="text-zinc-400 text-lg">Tidak ada produk sesuai filter.</p>
        <p className="text-zinc-500 text-sm mt-2">Coba ubah kriteria pencarian Anda</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-zinc-400 text-sm">
          Menampilkan <span className="text-amber-400 font-medium">{products.length}</span> produk
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}