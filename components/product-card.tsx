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
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={product.image || "/placeholder.svg"} alt={product.title} className="h-48 w-full object-cover" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground">
            {product.category}
          </span>
          <span className="font-semibold">{formatPriceIDR(product.price)}</span>
        </div>
        <CardTitle className="text-base md:text-lg">{product.title}</CardTitle>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <a href="#" aria-label={`Lihat detail untuk ${product.title}`}>
            Lihat Detail
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
