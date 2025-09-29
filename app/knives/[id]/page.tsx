import { notFound } from "next/navigation"
import { KNIVES } from "@/data/knives"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      amount,
    )
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

export default function Page({ params }: { params: { id: string } }) {
  const product = KNIVES.find((k) => k.id === params.id)
  if (!product) return notFound()

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {product.steel} • {product.handleMaterial}
            </span>
          </div>
        </div>
        <div className="text-xl font-bold">{formatPriceIDR(product.price)}</div>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* simple gallery: first image large, rest thumbs */}
            <img
              src={product.images[0] || "/placeholder.svg?height=400&width=600&query=knife%20image"}
              alt={`Foto utama ${product.title}`}
              className="h-72 w-full object-cover md:h-96"
            />
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 p-3">
                {product.images.slice(1).map((img, idx) => (
                  <img
                    key={img + idx}
                    src={img || "/placeholder.svg"}
                    alt={`Foto ${idx + 2} ${product.title}`}
                    className="h-24 w-full rounded object-cover"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <SpecRow label="Kategori" value={product.category} />
            <SpecRow label="Bahan Baja" value={product.steel} />
            <SpecRow label="Bahan Gagang" value={product.handleMaterial} />
            <SpecRow label="Panjang Bilah" value={`${product.bladeLengthCm} cm`} />
            <SpecRow label="Ketebalan Bilah" value={`${product.bladeThicknessMm} mm`} />
            <SpecRow label="Panjang Gagang" value={`${product.handleLengthCm} cm`} />
            <SpecRow label="Model Bilah" value={product.bladeStyle} />
            <SpecRow label="Model Gagang" value={product.handleStyle} />
            {product.weightGr ? <SpecRow label="Berat" value={`${product.weightGr} g`} /> : null}
            {product.specs
              ? Object.entries(product.specs).map(([k, v]) => <SpecRow key={k} label={k} value={String(v)} />)
              : null}
            {product.description ? (
              <div className="pt-2 text-pretty text-muted-foreground">{product.description}</div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
