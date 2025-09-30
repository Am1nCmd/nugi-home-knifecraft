"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArticleType } from "@/data/articles"

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

const initialFormData: ArticleFormData = {
  type: "news",
  title: "",
  excerpt: "",
  content: "",
  image: "",
  icon: "",
  publishDate: "",
  readTime: ""
}

export default function AdminArticleForm() {
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage("✅ Artikel berhasil ditambahkan!")
        setFormData(initialFormData)
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error || "Gagal menambahkan artikel"}`)
      }
    } catch (error) {
      setMessage("❌ Error: Gagal menambahkan artikel")
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isKnowledgeType = formData.type === "knowledge"
  const isBlogType = formData.type === "blog"

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <CardTitle className="text-white">Tambah Artikel Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Article Type */}
          <div>
            <Label htmlFor="type" className="text-zinc-300">Tipe Artikel</Label>
            <Select value={formData.type} onValueChange={(value: ArticleType) => handleInputChange("type", value)}>
              <SelectTrigger className="bg-zinc-700/50 border-zinc-600 text-white">
                <SelectValue placeholder="Pilih tipe artikel" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="news" className="text-white">Berita</SelectItem>
                <SelectItem value="knowledge" className="text-white">Ilmu Pengetahuan</SelectItem>
                <SelectItem value="blog" className="text-white">Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-zinc-300">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Masukkan judul artikel"
              className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt" className="text-zinc-300">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Masukkan ringkasan artikel"
              className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 min-h-[100px]"
              required
            />
          </div>

          {/* Content (for blog articles) */}
          {isBlogType && (
            <div>
              <Label htmlFor="content" className="text-zinc-300">Konten Lengkap</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Masukkan konten lengkap artikel"
                className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 min-h-[200px]"
              />
            </div>
          )}

          {/* Image (for news and blog) */}
          {!isKnowledgeType && (
            <div>
              <Label htmlFor="image" className="text-zinc-300">URL Gambar</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="/path/to/image.jpg"
                className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
              />
            </div>
          )}

          {/* Icon (for knowledge articles) */}
          {isKnowledgeType && (
            <div>
              <Label htmlFor="icon" className="text-zinc-300">Ikon</Label>
              <Select value={formData.icon} onValueChange={(value) => handleInputChange("icon", value)}>
                <SelectTrigger className="bg-zinc-700/50 border-zinc-600 text-white">
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="square" className="text-white">Square</SelectItem>
                  <SelectItem value="circle" className="text-white">Circle</SelectItem>
                  <SelectItem value="gradient" className="text-white">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Blog specific fields */}
          {isBlogType && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publishDate" className="text-zinc-300">Tanggal Publikasi</Label>
                <Input
                  id="publishDate"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange("publishDate", e.target.value)}
                  placeholder="15 Januari 2025"
                  className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
                />
              </div>
              <div>
                <Label htmlFor="readTime" className="text-zinc-300">Waktu Baca</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange("readTime", e.target.value)}
                  placeholder="8 menit"
                  className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
          >
            {isSubmitting ? "Menambahkan..." : "Tambah Artikel"}
          </Button>

          {message && (
            <div className={`text-center p-3 rounded ${
              message.startsWith("✅") ? "text-green-400 bg-green-900/20" : "text-red-400 bg-red-900/20"
            }`}>
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}