"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Article, ArticleType } from "@/data/articles"
import { Loader2, Save, X } from "lucide-react"

interface ArticleEditModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
  onSave?: (updatedArticle: Article) => void
}

type ArticleFormData = {
  type: ArticleType
  title: string
  excerpt: string
  content: string
  image: string
  icon: string
  publishDate: string
  readTime: string
}

export default function ArticleEditModal({ article, isOpen, onClose, onSave }: ArticleEditModalProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    type: "news",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    icon: "",
    publishDate: "",
    readTime: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  // Initialize form with article data
  useEffect(() => {
    if (article && isOpen) {
      setFormData({
        type: article.type || "news",
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        image: article.image || "",
        icon: article.icon || "",
        publishDate: article.publishDate || "",
        readTime: article.readTime || ""
      })
      setMessage("")
    }
  }, [article, isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessage("")
    }
  }, [isOpen])

  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!article) return

    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage("✅ Artikel berhasil diupdate!")

        // Call onSave callback with updated article
        if (onSave && data?.article) {
          onSave(data.article)
        }

        // Close modal after successful update
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error || "Gagal mengupdate artikel"}`)
      }
    } catch (error) {
      setMessage("❌ Error: Gagal mengupdate artikel")
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!article) return null

  const isKnowledgeType = formData.type === "knowledge"
  const isBlogType = formData.type === "blog"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-800 border-zinc-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl">Edit Artikel</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Edit informasi artikel: {article.title}
              </DialogDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Article Type */}
            <div className="grid gap-2">
              <Label className="text-zinc-200">Tipe Artikel</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ArticleType) => handleInputChange("type", value)}
              >
                <SelectTrigger className="bg-zinc-700/50 border-zinc-600/50 text-white">
                  <SelectValue placeholder="Pilih tipe artikel" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="news">Berita</SelectItem>
                  <SelectItem value="knowledge">Ilmu Pengetahuan</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-zinc-200">Judul</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Judul artikel..."
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            {/* Image URL */}
            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-zinc-200">URL Gambar</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
              />
            </div>

            {/* Icon (for knowledge type) */}
            {isKnowledgeType && (
              <div className="grid gap-2">
                <Label htmlFor="edit-icon" className="text-zinc-200">Icon</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                  placeholder="Icon untuk knowledge card"
                  className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                />
              </div>
            )}

            {/* Publish Date (for blog type) */}
            {isBlogType && (
              <div className="grid gap-2">
                <Label htmlFor="edit-publishDate" className="text-zinc-200">Tanggal Publish</Label>
                <Input
                  id="edit-publishDate"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange("publishDate", e.target.value)}
                  placeholder="2024-01-01"
                  className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                />
              </div>
            )}

            {/* Read Time (for blog type) */}
            {isBlogType && (
              <div className="grid gap-2">
                <Label htmlFor="edit-readTime" className="text-zinc-200">Waktu Baca</Label>
                <Input
                  id="edit-readTime"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange("readTime", e.target.value)}
                  placeholder="5 menit"
                  className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="grid gap-2">
            <Label htmlFor="edit-excerpt" className="text-zinc-200">Ringkasan</Label>
            <Textarea
              id="edit-excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Ringkasan singkat artikel..."
              className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400 min-h-[100px]"
              required
            />
          </div>

          {/* Content */}
          <div className="grid gap-2">
            <Label htmlFor="edit-content" className="text-zinc-200">
              Konten {isBlogType ? "(Wajib untuk blog)" : "(Opsional)"}
            </Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Konten lengkap artikel..."
              className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400 min-h-[200px]"
              required={isBlogType}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
            <div className="flex-1">
              {message && (
                <p className={`text-sm ${message.includes("berhasil") ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}