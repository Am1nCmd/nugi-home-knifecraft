"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type BlogArticle = {
  id: number
  title: string
  excerpt: string
  thumbnail: string
  publishDate: string
  readTime: string
}

const blogArticles: BlogArticle[] = [
  {
    id: 1,
    title: "Kisah Dibalik Pembuatan Pisau Dapur Tradisional",
    excerpt: "Menyelami proses pembuatan pisau dapur tradisional dari tangan ahli pandai besi yang telah mewarisi teknik turun temurun selama puluhan tahun. Setiap langkah memiliki makna dan presisi yang tinggi.",
    thumbnail: "/blog/traditional-knife-making.jpg",
    publishDate: "15 Januari 2025",
    readTime: "8 menit"
  },
  {
    id: 2,
    title: "Proses Heat Treatment: Rahasia Ketajaman Pisau",
    excerpt: "Memahami proses heat treatment yang menjadi kunci utama ketajaman dan ketahanan pisau. Dari proses quenching hingga tempering, setiap tahap menentukan kualitas akhir pisau.",
    thumbnail: "/blog/heat-treatment-process.jpg",
    publishDate: "12 Januari 2025",
    readTime: "10 menit"
  },
  {
    id: 3,
    title: "Review: Pisau Chef Damascus Steel Premium",
    excerpt: "Pengalaman menggunakan pisau chef Damascus steel premium selama 6 bulan. Mulai dari performa memotong, ketahanan ketajaman, hingga kemudahan perawatan sehari-hari.",
    thumbnail: "/blog/damascus-chef-knife-review.jpg",
    publishDate: "10 Januari 2025",
    readTime: "6 menit"
  },
  {
    id: 4,
    title: "Tutorial Lengkap Perawatan Pisau Carbon Steel",
    excerpt: "Panduan step-by-step merawat pisau carbon steel agar tetap tajam dan bebas karat. Termasuk tips pembersihan, penyimpanan, dan pengasahan yang tepat.",
    thumbnail: "/blog/carbon-steel-maintenance.jpg",
    publishDate: "8 Januari 2025",
    readTime: "12 menit"
  },
  {
    id: 5,
    title: "Sejarah dan Evolusi Pisau Jepang",
    excerpt: "Menelusuri sejarah panjang pisau Jepang dari era samurai hingga modern. Bagaimana tradisi katana berkembang menjadi pisau dapur yang diakui dunia.",
    thumbnail: "/blog/japanese-knife-history.jpg",
    publishDate: "5 Januari 2025",
    readTime: "15 menit"
  },
  {
    id: 6,
    title: "Tips Memilih Pisau Pertama untuk Pemula",
    excerpt: "Panduan lengkap bagi pemula dalam memilih pisau pertama. Mulai dari jenis blade, handle material, hingga budget yang sesuai untuk memulai koleksi pisau.",
    thumbnail: "/blog/beginner-knife-guide.jpg",
    publishDate: "3 Januari 2025",
    readTime: "9 menit"
  }
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-900">
      <Header />

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Blog <span className="text-amber-400">Knife Craft</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl leading-relaxed">
            Eksplorasi dunia pisau melalui cerita pembuatan, tips perawatan, review produk,
            dan tutorial dari para ahli. Tingkatkan pengetahuan Anda tentang seni kerajinan pisau.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20">
              <div className="aspect-video relative overflow-hidden bg-zinc-900/50">
                <img
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                  <span>{article.publishDate}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold leading-tight line-clamp-2 text-white">
                  {article.title}
                </h2>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-zinc-300 leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <Button variant="outline" className="w-full border-amber-600/30 text-amber-400 hover:bg-amber-600/10">
                  Baca Selengkapnya
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" variant="outline" className="border-amber-600/30 text-amber-400 hover:bg-amber-600/10">
            Muat Artikel Lainnya
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}