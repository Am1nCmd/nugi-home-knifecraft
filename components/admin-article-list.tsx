"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye } from "lucide-react"
import { Article, ArticleType } from "@/data/articles"
import ArticlePreviewModal from "./admin/article-preview-modal"
import ArticleEditModal from "./admin/article-edit-modal"

export default function AdminArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ArticleType>("news")
  const [makerFilter, setMakerFilter] = useState<string>("all")

  // Modal states
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams()
      if (makerFilter !== "all") params.append("maker", makerFilter)

      const response = await fetch(`/api/articles?${params.toString()}`)
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

  // Get unique makers for filter
  const makers = useMemo(() => {
    const makerSet = new Set<string>()
    articles.forEach((article: Article) => {
      if (article.createdBy?.name) makerSet.add(article.createdBy.name)
      if (article.updatedBy?.name && article.updatedBy.name !== article.createdBy?.name) makerSet.add(article.updatedBy.name)
    })
    return Array.from(makerSet).sort()
  }, [articles])

  useEffect(() => {
    fetchArticles()
  }, [makerFilter])

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

  const handlePreviewArticle = (article: Article) => {
    setSelectedArticle(article)
    setPreviewModalOpen(true)
  }

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article)
    setEditModalOpen(true)
  }

  const handleEditSave = (updatedArticle: Article) => {
    // Refresh the articles list after successful edit
    fetchArticles()
  }

  const handleClosePreview = () => {
    setPreviewModalOpen(false)
    setSelectedArticle(null)
  }

  const handleCloseEdit = () => {
    setEditModalOpen(false)
    setSelectedArticle(null)
  }

  const handleEditToPreview = () => {
    setEditModalOpen(false)
    setPreviewModalOpen(true)
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
        {/* Maker Filter */}
        <div className="mb-6">
          <Select value={makerFilter} onValueChange={setMakerFilter}>
            <SelectTrigger className="w-64 bg-zinc-700/50 border-zinc-600/50 text-white">
              <SelectValue placeholder="Filter by Maker" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua Maker</SelectItem>
              {makers.map((maker) => (
                <SelectItem key={maker} value={maker}>
                  {maker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
            <ArticleGrid
              articles={filteredArticles}
              onDelete={handleDelete}
              onPreview={handlePreviewArticle}
              onEdit={handleEditArticle}
            />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <ArticleGrid
              articles={filteredArticles}
              onDelete={handleDelete}
              onPreview={handlePreviewArticle}
              onEdit={handleEditArticle}
            />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <ArticleGrid
              articles={filteredArticles}
              onDelete={handleDelete}
              onPreview={handlePreviewArticle}
              onEdit={handleEditArticle}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Preview Modal */}
      <ArticlePreviewModal
        article={selectedArticle}
        isOpen={previewModalOpen}
        onClose={handleClosePreview}
        onEdit={handleEditToPreview}
      />

      {/* Edit Modal */}
      <ArticleEditModal
        article={selectedArticle}
        isOpen={editModalOpen}
        onClose={handleCloseEdit}
        onSave={handleEditSave}
      />
    </Card>
  )
}

function ArticleGrid({
  articles,
  onDelete,
  onPreview,
  onEdit
}: {
  articles: Article[]
  onDelete: (id: string) => void
  onPreview: (article: Article) => void
  onEdit: (article: Article) => void
}) {
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
                {article.createdBy?.name && (
                  <>
                    <span>•</span>
                    <span>Maker: {article.createdBy.name}</span>
                  </>
                )}
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
                onClick={() => onPreview(article)}
                title="Preview artikel"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
                onClick={() => onEdit(article)}
                title="Edit artikel"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(article.id)}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                title="Hapus artikel"
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