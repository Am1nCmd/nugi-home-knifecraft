import ToolProductCard from "./product-card"
import type { UnifiedProduct } from "@/data/unified-products"

export default function ToolsGrid({ products }: { products: UnifiedProduct[] }) {
  if (!products.length) {
    return <p className="text-sm text-muted-foreground">Tidak ada produk yang cocok dengan filter.</p>
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ToolProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
