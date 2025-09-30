"use client"

import { useState, useEffect } from "react"
import { Article } from "@/data/articles"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function HomeNews() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetcher("/api/articles?type=news")
        setArticles(response.articles || [])
      } catch (error) {
        console.error("Error fetching news articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat berita...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl">Berita tentang Pisau</h2>
          <p className="text-muted-foreground leading-relaxed">
            Update terbaru seputar tren, event, dan tips perawatan.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <article key={article.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h3 className="font-serif text-lg">{article.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
