"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye } from "lucide-react"
import { Article, ArticleType } from "@/data/articles"

export default function AdminArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ArticleType>("news")

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setArticles(prev => prev.filter(article => article.id !== id))
      } else {
        alert("Gagal menghapus artikel")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Gagal menghapus artikel")
    }
  }

  const getTypeLabel = (type: ArticleType) => {
    switch (type) {
      case "news": return "Berita"
      case "knowledge": return "Ilmu Pengetahuan"
      case "blog": return "Blog"
      default: return type
    }
  }

  const getTypeColor = (type: ArticleType) => {
    switch (type) {
      case "news": return "bg-blue-600"
      case "knowledge": return "bg-green-600"
      case "blog": return "bg-purple-600"
      default: return "bg-gray-600"
    }
  }

  const filteredArticles = articles.filter(article => article.type === activeTab)

  if (loading) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Memuat artikel...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <CardTitle className="text-white">Kelola Artikel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as ArticleType)}>
          <TabsList className="grid w-full grid-cols-3 bg-zinc-700/50">
            <TabsTrigger value="news" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Berita ({articles.filter(a => a.type === "news").length})
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Pengetahuan ({articles.filter(a => a.type === "knowledge").length})
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Blog ({articles.filter(a => a.type === "blog").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            <ArticleGrid articles={filteredArticles} onDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <ArticleGrid articles={filteredArticles} onDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <ArticleGrid articles={filteredArticles} onDelete={handleDelete} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ArticleGrid({ articles, onDelete }: { articles: Article[]; onDelete: (id: string) => void }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">Belum ada artikel untuk kategori ini.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-zinc-700/30 border border-zinc-600/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getTypeColor(article.type)} text-white`}>
                  {getTypeLabel(article.type)}
                </Badge>
                {article.publishDate && (
                  <span className="text-xs text-zinc-400">{article.publishDate}</span>
                )}
                {article.readTime && (
                  <span className="text-xs text-zinc-400">• {article.readTime}</span>
                )}
              </div>

              <h3 className="text-white font-semibold mb-2 line-clamp-1">
                {article.title}
              </h3>

              <p className="text-zinc-300 text-sm line-clamp-2 mb-3">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>ID: {article.id}</span>
                <span>•</span>
                <span>Dibuat: {new Date(article.createdAt).toLocaleDateString("id-ID")}</span>
                {article.updatedAt !== article.createdAt && (
                  <>
                    <span>•</span>
                    <span>Diupdate: {new Date(article.updatedAt).toLocaleDateString("id-ID")}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(article.id)}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getTypeLabel(type: ArticleType) {
  switch (type) {
    case "news": return "Berita"
    case "knowledge": return "Ilmu Pengetahuan"
    case "blog": return "Blog"
    default: return type
  }
}

function getTypeColor(type: ArticleType) {
  switch (type) {
    case "news": return "bg-blue-600"
    case "knowledge": return "bg-green-600"
    case "blog": return "bg-purple-600"
    default: return "bg-gray-600"
  }
}