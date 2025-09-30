import { promises as fs } from "node:fs"
import path from "node:path"
import { Article, ArticleType, normalizeArticle } from "@/data/articles"

type ArticlesDbSchema = {
  articles: Article[]
  metadata?: {
    version: string
    createdAt: string
    totalArticles: number
    articleTypes: {
      news: number
      knowledge: number
      blog: number
    }
  }
}

const ARTICLES_DB_PATH = path.join(process.cwd(), "data", "articles.db.json")

let writeLock = Promise.resolve()

async function ensureArticlesDb(): Promise<void> {
  try {
    await fs.access(ARTICLES_DB_PATH)
  } catch {
    // init folder and file
    await fs.mkdir(path.dirname(ARTICLES_DB_PATH), { recursive: true })
    const initial: ArticlesDbSchema = {
      articles: [],
      metadata: {
        version: "1.0",
        createdAt: new Date().toISOString(),
        totalArticles: 0,
        articleTypes: { news: 0, knowledge: 0, blog: 0 }
      }
    }
    await fs.writeFile(ARTICLES_DB_PATH, JSON.stringify(initial, null, 2), "utf8")
  }
}

async function readArticlesDb(): Promise<ArticlesDbSchema> {
  await ensureArticlesDb()
  const data = await fs.readFile(ARTICLES_DB_PATH, "utf8")
  try {
    const parsed = JSON.parse(data) as ArticlesDbSchema
    // Ensure metadata exists
    if (!parsed.metadata) {
      parsed.metadata = {
        version: "1.0",
        createdAt: new Date().toISOString(),
        totalArticles: parsed.articles.length,
        articleTypes: {
          news: parsed.articles.filter(a => a.type === "news").length,
          knowledge: parsed.articles.filter(a => a.type === "knowledge").length,
          blog: parsed.articles.filter(a => a.type === "blog").length
        }
      }
    }
    return parsed
  } catch {
    return {
      articles: [],
      metadata: {
        version: "1.0",
        createdAt: new Date().toISOString(),
        totalArticles: 0,
        articleTypes: { news: 0, knowledge: 0, blog: 0 }
      }
    }
  }
}

async function writeArticlesDb(next: ArticlesDbSchema): Promise<void> {
  // Update metadata before writing
  next.metadata = {
    version: "1.0",
    createdAt: next.metadata?.createdAt || new Date().toISOString(),
    totalArticles: next.articles.length,
    articleTypes: {
      news: next.articles.filter(a => a.type === "news").length,
      knowledge: next.articles.filter(a => a.type === "knowledge").length,
      blog: next.articles.filter(a => a.type === "blog").length
    }
  }

  // serialize writes
  writeLock = writeLock.then(() => fs.writeFile(ARTICLES_DB_PATH, JSON.stringify(next, null, 2), "utf8"))
  return writeLock
}

// Get all articles
export async function getArticles(): Promise<Article[]> {
  const db = await readArticlesDb()
  return db.articles
}

// Get articles by type
export async function getArticlesByType(type: ArticleType): Promise<Article[]> {
  const db = await readArticlesDb()
  return db.articles.filter(a => a.type === type)
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  const db = await readArticlesDb()
  return db.articles.find(a => a.id === id) || null
}

function genArticleId(type: ArticleType = "news") {
  // simple unique id with type prefix
  const prefix = type === "news" ? "n_" : type === "knowledge" ? "k_" : "b_"
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export async function addArticle(a: Partial<Article>) {
  const normalized = normalizeArticle(a)

  // Generate ID if not provided
  if (!normalized.id) {
    normalized.id = genArticleId(normalized.type)
  }

  // Set timestamps
  normalized.updatedAt = new Date().toISOString()
  if (!normalized.createdAt) {
    normalized.createdAt = normalized.updatedAt
  }

  const db = await readArticlesDb()

  // upsert by id
  const idx = db.articles.findIndex((x) => x.id === normalized.id)
  if (idx >= 0) {
    // Keep original createdAt for updates
    normalized.createdAt = db.articles[idx].createdAt
    db.articles[idx] = normalized
  } else {
    db.articles.push(normalized)
  }

  await writeArticlesDb(db)
  return normalized
}

export async function updateArticle(id: string, updates: Partial<Article>) {
  const db = await readArticlesDb()
  const idx = db.articles.findIndex(a => a.id === id)

  if (idx === -1) {
    throw new Error(`Article with ID ${id} not found`)
  }

  const existing = db.articles[idx]
  const updated = normalizeArticle({
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  })

  db.articles[idx] = updated
  await writeArticlesDb(db)
  return updated
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = await readArticlesDb()
  const idx = db.articles.findIndex(a => a.id === id)

  if (idx === -1) {
    return false
  }

  db.articles.splice(idx, 1)
  await writeArticlesDb(db)
  return true
}

export async function addManyArticles(articles: Partial<Article>[]) {
  const db = await readArticlesDb()
  const timestamp = new Date().toISOString()

  for (const a of articles) {
    try {
      const normalized = normalizeArticle(a)

      // Generate ID if not provided
      if (!normalized.id || normalized.id.trim() === '') {
        normalized.id = genArticleId(normalized.type)
      }

      // Set timestamps
      normalized.updatedAt = timestamp
      if (!normalized.createdAt) {
        normalized.createdAt = timestamp
      }

      // Basic validation
      if (!normalized.title || !normalized.excerpt) {
        continue
      }

      const idx = db.articles.findIndex((x) => x.id === normalized.id)
      if (idx >= 0) {
        // Keep original createdAt for updates
        normalized.createdAt = db.articles[idx].createdAt
        db.articles[idx] = normalized
      } else {
        db.articles.push(normalized)
      }
    } catch (error) {
      // Skip invalid articles
      console.warn(`Skipping invalid article:`, error)
      continue
    }
  }

  await writeArticlesDb(db)
}