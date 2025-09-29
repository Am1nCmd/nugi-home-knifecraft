import Image from "next/image"
import { notFound } from "next/navigation"
import { TOOLS } from "@/data/tools"
import { Card, CardContent } from "@/components/ui/card"

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const item = TOOLS.find((p) => p.id === params.id)
  if (!item) return notFound()

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-sm text-muted-foreground">
          {item.category} · Rp {item.price.toLocaleString("id-ID")}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Galeri */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {item.images.map((src, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Foto ${item.title} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spesifikasi */}
        <Card>
          <CardContent className="p-4">
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Baja</dt>
                <dd>{item.steel}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Bahan Gagang</dt>
                <dd>{item.handleMaterial}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Panjang Bilah</dt>
                <dd>{item.bladeLengthCm} cm</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ketebalan Bilah</dt>
                <dd>{item.bladeThicknessMm} mm</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Panjang Gagang</dt>
                <dd>{item.handleLengthCm} cm</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Berat</dt>
                <dd>{item.weightGr ? `${item.weightGr} gr` : "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Model Bilah</dt>
                <dd>{item.bladeStyle}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Model Gagang</dt>
                <dd>{item.handleStyle}</dd>
              </div>
              {item.specs &&
                Object.entries(item.specs).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd>{String(v)}</dd>
                  </div>
                ))}
            </dl>
            {item.description && <p className="mt-4 text-sm text-pretty">{item.description}</p>}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
