"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Article } from "@/data/articles"
import { X, User, Calendar, Edit, FileText, Clock, Eye } from "lucide-react"

interface ArticlePreviewModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
}

function getTypeLabel(type: string) {
  switch (type) {
    case "news": return "Berita"
    case "knowledge": return "Ilmu Pengetahuan"
    case "blog": return "Blog"
    default: return type
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "news": return "bg-blue-600/20 text-blue-400 border-blue-600/30"
    case "knowledge": return "bg-green-600/20 text-green-400 border-green-600/30"
    case "blog": return "bg-purple-600/20 text-purple-400 border-purple-600/30"
    default: return "bg-gray-600/20 text-gray-400 border-gray-600/30"
  }
}

export default function ArticlePreviewModal({ article, isOpen, onClose, onEdit }: ArticlePreviewModalProps) {
  if (!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-800 border-zinc-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl">{article.title}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Preview detail artikel
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEdit}
                  className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Image */}
          {article.image && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Gambar Artikel</h3>
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-zinc-900/50">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-medium">Informasi Dasar</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor(article.type)}>
                    {getTypeLabel(article.type)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">ID Artikel:</span>
                    <span className="text-zinc-300 font-mono text-sm">{article.id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tipe:</span>
                    <span className="text-zinc-300">{getTypeLabel(article.type)}</span>
                  </div>

                  {article.publishDate && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Tanggal Publish:</span>
                      <span className="text-zinc-300">{article.publishDate}</span>
                    </div>
                  )}

                  {article.readTime && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Waktu Baca:</span>
                      <span className="text-zinc-300">{article.readTime}</span>
                    </div>
                  )}

                  {article.icon && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Icon:</span>
                      <span className="text-zinc-300">{article.icon}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-medium">Status Artikel</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Konten</span>
                </div>
                <div className="pl-6">
                  <span className="text-zinc-300">
                    {article.content ? `${article.content.length} karakter` : "Tidak ada konten"}
                  </span>
                </div>

                {article.excerpt && (
                  <>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Ringkasan</span>
                    </div>
                    <div className="pl-6">
                      <span className="text-zinc-300">
                        {article.excerpt.length} karakter
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Ringkasan</h3>
              <p className="text-zinc-300 leading-relaxed bg-zinc-700/30 p-4 rounded-lg border border-zinc-600/50">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          {article.content && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Konten</h3>
              <div className="bg-zinc-700/30 p-4 rounded-lg border border-zinc-600/50 max-h-96 overflow-y-auto">
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-zinc-700/50 space-y-4">
            <h3 className="text-white font-medium">Informasi Metadata</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Created Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Dibuat</span>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="text-zinc-300 text-sm">
                    {article.createdAt ? new Date(article.createdAt).toLocaleString("id-ID") : "Tidak diketahui"}
                  </div>
                  {article.createdBy && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <User className="w-3 h-3" />
                      <span>{article.createdBy.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Updated Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Terakhir Diupdate</span>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="text-zinc-300 text-sm">
                    {article.updatedAt ? new Date(article.updatedAt).toLocaleString("id-ID") : "Tidak diketahui"}
                  </div>
                  {article.updatedBy && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <User className="w-3 h-3" />
                      <span>{article.updatedBy.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}