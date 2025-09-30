"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Article } from "@/data/articles"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogArticles = async () => {
      try {
        const response = await fetcher("/api/articles?type=blog")
        setArticles(response.articles || [])
      } catch (error) {
        console.error("Error fetching blog articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogArticles()
  }, [])

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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-zinc-300">Memuat artikel blog...</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20">
                <Link href={`/blog/${article.id}`}>
                  <div className="aspect-video relative overflow-hidden bg-zinc-900/50">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                    {article.publishDate && <span>{article.publishDate}</span>}
                    {article.publishDate && article.readTime && <span>•</span>}
                    {article.readTime && <span>{article.readTime}</span>}
                  </div>
                  <Link href={`/blog/${article.id}`}>
                    <h2 className="text-xl font-semibold leading-tight line-clamp-2 text-white hover:text-amber-400 transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-zinc-300 leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <Link href={`/blog/${article.id}`}>
                    <Button variant="outline" className="w-full border-amber-600/30 text-amber-400 hover:bg-amber-600/10">
                      Baca Selengkapnya
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" className="border-amber-600/30 text-amber-400 hover:bg-amber-600/10">
              Muat Artikel Lainnya
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}