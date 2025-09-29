import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/data/products"

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] overflow-hidden bg-zinc-900/50">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-amber-600/30 bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-400">
            {product.category}
          </span>
          <span className="font-bold text-white text-lg">{formatPriceIDR(product.price)}</span>
        </div>
        <CardTitle className="text-lg md:text-xl text-white font-semibold leading-tight">
          {product.title}
        </CardTitle>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium">
          <a href="#" aria-label={`Lihat detail untuk ${product.title}`}>
            Lihat Detail
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
