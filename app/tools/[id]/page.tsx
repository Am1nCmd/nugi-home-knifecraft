import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getTools } from "@/lib/store"

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      amount,
    )
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

export default async function ToolDetailPage({ params }: { params: { id: string } }) {
  const tools = await getTools()
  const item = tools.find((p) => p.id === params.id)
  if (!item) return notFound()

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-8 text-white">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl text-white">{item.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              <span className="text-sm text-zinc-400">
                {item.steel} • {item.handleMaterial}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xl font-bold text-white">{formatPriceIDR(item.price)}</div>
            <WhatsAppButton
              productTitle={item.title}
              productPrice={formatPriceIDR(item.price)}
            />
          </div>
        </div>

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
      <Footer />
    </div>
  )
}
