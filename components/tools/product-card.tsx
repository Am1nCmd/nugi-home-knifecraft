import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ToolProduct } from "@/data/tools"

export default function ToolProductCard({ product }: { product: ToolProduct }) {
  const cover = product.images[0] || "/placeholder.svg?height=320&width=480"
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden rounded-t-md bg-muted">
          <Image
            src={cover || "/placeholder.svg"}
            alt={`Foto ${product.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-1 pt-4">
        <CardTitle className="text-base">{product.title}</CardTitle>
        <div className="text-xs text-muted-foreground">{product.category}</div>
        <div className="text-sm font-semibold">Rp {product.price.toLocaleString("id-ID")}</div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild size="sm" className="w-full">
          <Link href={`/tools/${product.id}`} aria-label={`Detail ${product.title}`}>
            Detail
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
