import KnifeProductCard from "./product-card"
import type { KnifeProduct } from "@/data/knives"

export default function KnivesGrid({ products }: { products: KnifeProduct[] }) {
  if (!products || products.length === 0) {
    return <p className="text-sm text-muted-foreground">Tidak ada produk sesuai filter.</p>
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {products.map((p) => (
        <KnifeProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
