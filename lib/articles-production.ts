import { promises as fs } from "node:fs"
import path from "node:path"
import { Article, ArticleType, normalizeArticle } from "@/data/articles"

// Vercel KV import (will be undefined in development)
let kv: any = null
try {
  if (process.env.VERCEL && process.env.KV_REST_API_URL) {
    const kvModule = require('@vercel/kv')
    kv = kvModule.kv || kvModule.default || kvModule

    // Validate that KV has the required methods
    if (kv && typeof kv.get !== 'function') {
      console.warn('KV object does not have get method, falling back to null')
      kv = null
    }
  }
} catch (error) {
  console.warn('Failed to initialize KV:', error)
  kv = null
}

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

const DB_PATH = path.join(process.cwd(), "data", "articles.db.json")
const KV_KEY = 'nugi_articles_db'

// Environment detection
const isProduction = process.env.NODE_ENV === 'production'
const isVercel = !!process.env.VERCEL
const hasKV = isVercel && !!kv && !!process.env.KV_REST_API_URL

// In-memory fallback for environments without persistent storage
let memoryStore: ArticlesDbSchema | null = null
let writeLock = Promise.resolve()

async function getInitialDb(): Promise<ArticlesDbSchema> {
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

async function ensureDb(): Promise<void> {
  if (hasKV) {
    // Vercel KV is ready, no setup needed
    return
  }

  if (isProduction) {
    // Production without KV - use memory store
    if (!memoryStore) {
      memoryStore = await getInitialDb()
    }
    return
  }

  // Development - use file system
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    const initial = await getInitialDb()
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8")
  }
}

async function readDb(): Promise<ArticlesDbSchema> {
  await ensureDb()

  if (hasKV) {
    // Read from Vercel KV
    try {
      const data = await kv.get(KV_KEY)
      if (data && typeof data === 'object') {
        return data as ArticlesDbSchema
      }
    } catch (error) {
      console.warn('Failed to read articles from KV:', error)
    }
    // Fallback to initial DB if KV read fails
    return await getInitialDb()
  }

  if (isProduction) {
    // Production without KV - use memory store
    return memoryStore || await getInitialDb()
  }

  // Development - read from file
  const data = await fs.readFile(DB_PATH, "utf8")
  try {
    const parsed = JSON.parse(data) as ArticlesDbSchema
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
    return await getInitialDb()
  }
}

async function writeDb(next: ArticlesDbSchema): Promise<void> {
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

  if (hasKV) {
    // Write to Vercel KV
    try {
      await kv.set(KV_KEY, next)
      return
    } catch (error) {
      console.error('Failed to write articles to KV:', error)
      throw error
    }
  }

  if (isProduction) {
    // Production without KV - update memory store
    memoryStore = { ...next }
    console.warn('⚠️ Running in production without persistent storage. Articles changes will be lost on restart.')
    return
  }

  // Development - write to file
  writeLock = writeLock.then(() => fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8"))
  return writeLock
}

// Get all articles
export async function getArticles(): Promise<Article[]> {
  const db = await readDb()
  return db.articles
}

// Get articles by type
export async function getArticlesByType(type: ArticleType): Promise<Article[]> {
  const db = await readDb()
  return db.articles.filter(a => a.type === type)
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  const db = await readDb()
  return db.articles.find(a => a.id === id) || null
}

function genArticleId(type: ArticleType = "news") {
  const prefix = type === "news" ? "n_" : type === "knowledge" ? "k_" : "b_"
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export async function addArticle(a: Partial<Article>) {
  const normalized = normalizeArticle(a)

  if (!normalized.id) {
    normalized.id = genArticleId(normalized.type)
  }

  normalized.updatedAt = new Date().toISOString()
  if (!normalized.createdAt) {
    normalized.createdAt = normalized.updatedAt
  }

  const db = await readDb()

  const idx = db.articles.findIndex((x) => x.id === normalized.id)
  if (idx >= 0) {
    normalized.createdAt = db.articles[idx].createdAt
    db.articles[idx] = normalized
  } else {
    db.articles.push(normalized)
  }

  await writeDb(db)
  return normalized
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  const db = await readDb()
  const idx = db.articles.findIndex(a => a.id === id)

  if (idx === -1) {
    return null
  }

  const existing = db.articles[idx]
  const normalized = normalizeArticle({
    ...existing,
    ...updates,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  })

  db.articles[idx] = normalized
  await writeDb(db)
  return normalized
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = await readDb()
  const idx = db.articles.findIndex(a => a.id === id)

  if (idx === -1) {
    return false
  }

  db.articles.splice(idx, 1)
  await writeDb(db)
  return true
}

export async function addManyArticles(articles: Partial<Article>[]) {
  const db = await readDb()
  const timestamp = new Date().toISOString()

  for (const a of articles) {
    try {
      const normalized = normalizeArticle(a)

      if (!normalized.id || normalized.id.trim() === '') {
        normalized.id = genArticleId(normalized.type)
      }

      normalized.updatedAt = timestamp
      if (!normalized.createdAt) {
        normalized.createdAt = timestamp
      }

      if (!normalized.title || !normalized.excerpt) {
        continue
      }

      const idx = db.articles.findIndex((x) => x.id === normalized.id)
      if (idx >= 0) {
        normalized.createdAt = db.articles[idx].createdAt
        db.articles[idx] = normalized
      } else {
        db.articles.push(normalized)
      }
    } catch (error) {
      console.warn(`Skipping invalid article:`, error)
      continue
    }
  }

  await writeDb(db)
}

// Utility functions for database status
export function getArticlesDatabaseInfo() {
  return {
    environment: isProduction ? 'production' : 'development',
    isVercel: isVercel,
    hasKV: hasKV,
    storageType: hasKV ? 'vercel-kv' : (isProduction ? 'memory' : 'file'),
    dbPath: hasKV ? 'Vercel KV' : (isProduction ? 'in-memory' : DB_PATH),
    persistent: hasKV || !isProduction,
    kvConfig: hasKV ? {
      url: process.env.KV_REST_API_URL ? '***configured***' : 'not-set',
      token: process.env.KV_REST_API_TOKEN ? '***configured***' : 'not-set'
    } : null
  }
}

export function isReadOnlyMode(): boolean {
  return isProduction && !hasKV
}