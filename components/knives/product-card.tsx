"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { KnifeProduct } from "@/data/knives"

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      amount,
    )
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

export default function KnifeProductCard({ product }: { product: KnifeProduct }) {
  const cover = product.images?.[0] || "/placeholder.svg?height=320&width=480"
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={cover || "/placeholder.svg"} alt={product.title} className="h-48 w-full object-cover" />
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
          <Link href={`/knives/${product.id}`} aria-label={`Lihat detail untuk ${product.title}`}>
            Lihat Detail
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
