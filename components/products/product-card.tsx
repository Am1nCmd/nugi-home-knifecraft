"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import type { UnifiedProduct } from "@/data/unified-products"

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      amount,
    )
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

export default function ProductCard({ product }: { product: UnifiedProduct }) {
  const cover = product.images?.[0] || "/placeholder.svg?height=320&width=480"

  // Determine the detail page URL based on product type
  const detailUrl = product.type === "knife" ? `/knives/${product.id}` : `/tools/${product.id}`

  // Get type badge color
  const typeColor = product.type === "knife" ? "bg-blue-600/20 text-blue-400 border-blue-600/30" : "bg-green-600/20 text-green-400 border-green-600/30"

  return (
    <Card className="overflow-hidden bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] overflow-hidden bg-zinc-900/50">
          <img
            src={cover || "/placeholder.svg"}
            alt={product.title}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="mb-3 flex items-center gap-2">
          <Badge className={`${typeColor} text-xs font-medium`}>
            {product.type === "knife" ? "Pisau" : "Tools"}
          </Badge>
          <Badge variant="outline" className="border-amber-600/30 bg-amber-600/10 text-amber-400 text-xs font-medium">
            {product.category}
          </Badge>
        </div>

        <CardTitle className="text-lg md:text-xl text-white font-semibold leading-tight mb-3">
          {product.title}
        </CardTitle>

        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-lg">{formatPriceIDR(product.price)}</span>
          {product.bladeLengthCm > 0 && (
            <span className="text-zinc-400 text-sm">{product.bladeLengthCm} cm</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6 space-y-3 flex flex-col">
        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium">
          <Link href={detailUrl} aria-label={`Lihat detail untuk ${product.title}`}>
            Lihat Detail
          </Link>
        </Button>
        <WhatsAppButton
          productTitle={product.title}
          productPrice={formatPriceIDR(product.price)}
          className="w-full"
          variant="outline"
        />
      </CardFooter>
    </Card>
  )
}