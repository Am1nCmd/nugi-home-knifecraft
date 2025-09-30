import KnifeProductCard from "./product-card"
import type { UnifiedProduct } from "@/data/unified-products"

export default function KnivesGrid({ products }: { products: UnifiedProduct[] }) {
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {products.map((p) => (
        <KnifeProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
