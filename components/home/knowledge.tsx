"use client"

import { useState, useEffect } from "react"
import { Article } from "@/data/articles"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case "square":
      return <div className="w-6 h-6 bg-amber-400 rounded-sm"></div>
    case "circle":
      return <div className="w-6 h-6 bg-amber-500 rounded-full"></div>
    case "gradient":
      return <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-600 rounded"></div>
    default:
      return <div className="w-6 h-6 bg-amber-400 rounded-sm"></div>
  }
}

export function HomeKnowledge() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const response = await fetcher("/api/articles?type=knowledge")
        setArticles(response.articles || [])
      } catch (error) {
        console.error("Error fetching knowledge articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchKnowledge()
  }, [])

  if (loading) {
    return (
      <section className="border-t border-zinc-700/50 bg-gradient-to-b from-zinc-800/30 to-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-zinc-300">Memuat pengetahuan...</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="border-t border-zinc-700/50 bg-gradient-to-b from-zinc-800/30 to-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Ilmu <span className="text-amber-400">Pengetahuan</span>
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl mx-auto">
            Edukasi singkat tentang material dan proses pembuatan pisau berkualitas tinggi.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="rounded-2xl border border-zinc-700/50 bg-zinc-800/40 p-8 hover:bg-zinc-700/40 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center mb-6">
                {getIconComponent(article.icon || "square")}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-4">{article.title}</h3>
              <p className="text-zinc-300 leading-relaxed">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
