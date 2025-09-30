export type ArticleType = "news" | "knowledge" | "blog"

// Maker information type
export type MakerInfo = {
  email: string
  name: string
}

export type Article = {
  id: string
  type: ArticleType
  title: string
  excerpt: string
  content?: string // For full blog articles
  image?: string
  icon?: string // For knowledge cards (background icon style)
  publishDate?: string // For blog articles
  readTime?: string // For blog articles
  createdAt: string
  updatedAt: string

  // Maker attribution
  createdBy?: MakerInfo
  updatedBy?: MakerInfo
}

export function normalizeArticle(partial: Partial<Article>): Article {
  const now = new Date().toISOString()

  return {
    id: partial.id || "",
    type: partial.type || "news",
    title: partial.title || "",
    excerpt: partial.excerpt || "",
    content: partial.content || "",
    image: partial.image || "",
    icon: partial.icon || "",
    publishDate: partial.publishDate || "",
    readTime: partial.readTime || "",
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
  }
}