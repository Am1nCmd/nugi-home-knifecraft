import { promises as fs } from "node:fs"
import path from "node:path"
import { UnifiedProduct, normalizeProduct, toLegacyProduct, type LegacyProduct } from "@/data/unified-products"
import type { Product } from "@/data/products"

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

type DbSchema = {
  products: UnifiedProduct[]
  metadata?: {
    version: string
    createdAt: string
    totalProducts: number
    productTypes: {
      knives: number
      tools: number
    }
  }
}

const DB_PATH = path.join(process.cwd(), "data", "products.db.json")
const KV_KEY = 'nugi_products_db'

// Environment detection
const isProduction = process.env.NODE_ENV === 'production'
const isVercel = !!process.env.VERCEL
const hasKV = isVercel && !!kv && !!process.env.KV_REST_API_URL

// In-memory fallback for environments without persistent storage
let memoryStore: DbSchema | null = null
let writeLock = Promise.resolve()

async function getInitialDb(): Promise<DbSchema> {
  return {
    products: [],
    metadata: {
      version: "2.0",
      createdAt: new Date().toISOString(),
      totalProducts: 0,
      productTypes: { knives: 0, tools: 0 }
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

async function readDb(): Promise<DbSchema> {
  await ensureDb()

  if (hasKV) {
    // Read from Vercel KV
    try {
      const data = await kv.get(KV_KEY)
      if (data && typeof data === 'object') {
        return data as DbSchema
      }
    } catch (error) {
      console.warn('Failed to read from KV:', error)
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
    const parsed = JSON.parse(data) as DbSchema
    if (!parsed.metadata) {
      parsed.metadata = {
        version: "2.0",
        createdAt: new Date().toISOString(),
        totalProducts: parsed.products.length,
        productTypes: {
          knives: parsed.products.filter(p => p.type === "knife").length,
          tools: parsed.products.filter(p => p.type === "tool").length
        }
      }
    }
    return parsed
  } catch {
    return await getInitialDb()
  }
}

async function writeDb(next: DbSchema): Promise<void> {
  // Update metadata before writing
  next.metadata = {
    version: "2.0",
    createdAt: next.metadata?.createdAt || new Date().toISOString(),
    totalProducts: next.products.length,
    productTypes: {
      knives: next.products.filter(p => p.type === "knife").length,
      tools: next.products.filter(p => p.type === "tool").length
    }
  }

  if (hasKV) {
    // Write to Vercel KV
    try {
      await kv.set(KV_KEY, next)
      return
    } catch (error) {
      console.error('Failed to write to KV:', error)
      throw error
    }
  }

  if (isProduction) {
    // Production without KV - update memory store
    memoryStore = { ...next }
    console.warn('⚠️ Running in production without persistent storage. Changes will be lost on restart.')
    return
  }

  // Development - write to file
  writeLock = writeLock.then(() => fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8"))
  return writeLock
}

// Get all products (unified)
export async function getProducts(): Promise<UnifiedProduct[]> {
  const db = await readDb()
  return db.products
}

// Get products by type
export async function getKnives(): Promise<UnifiedProduct[]> {
  const db = await readDb()
  return db.products.filter(p => p.type === "knife")
}

export async function getTools(): Promise<UnifiedProduct[]> {
  const db = await readDb()
  return db.products.filter(p => p.type === "tool")
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<UnifiedProduct[]> {
  const db = await readDb()
  return db.products.filter(p => p.category === category)
}

// Legacy compatibility - get products as legacy format
export async function getLegacyProducts(): Promise<LegacyProduct[]> {
  const db = await readDb()
  return db.products.map(toLegacyProduct)
}

function genId(type: "knife" | "tool" = "knife") {
  const prefix = type === "knife" ? "k_" : "t_"
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export async function addProduct(p: Partial<UnifiedProduct>) {
  const normalized = normalizeProduct(p)

  if (!normalized.id) {
    normalized.id = genId(normalized.type)
  }

  normalized.updatedAt = new Date().toISOString()
  if (!normalized.createdAt) {
    normalized.createdAt = normalized.updatedAt
  }

  const db = await readDb()

  const idx = db.products.findIndex((x) => x.id === normalized.id)
  if (idx >= 0) {
    normalized.createdAt = db.products[idx].createdAt
    db.products[idx] = normalized
  } else {
    db.products.push(normalized)
  }

  await writeDb(db)
}

export async function addManyProducts(ps: Partial<UnifiedProduct>[]) {
  const db = await readDb()
  const timestamp = new Date().toISOString()

  for (const p of ps) {
    try {
      const normalized = normalizeProduct(p)

      if (!normalized.id || normalized.id.trim() === '') {
        normalized.id = genId(normalized.type)
      }

      normalized.updatedAt = timestamp
      if (!normalized.createdAt) {
        normalized.createdAt = timestamp
      }

      if (
        !normalized.title ||
        !Number.isFinite(normalized.price) ||
        !normalized.category ||
        !normalized.steel ||
        !normalized.handleMaterial ||
        !Number.isFinite(normalized.bladeLengthCm) ||
        !Number.isFinite(normalized.handleLengthCm) ||
        !normalized.bladeStyle ||
        !normalized.handleStyle
      ) {
        continue
      }

      const idx = db.products.findIndex((x) => x.id === normalized.id)
      if (idx >= 0) {
        normalized.createdAt = db.products[idx].createdAt
        db.products[idx] = normalized
      } else {
        db.products.push(normalized)
      }
    } catch (error) {
      console.warn(`Skipping invalid product:`, error)
      continue
    }
  }

  await writeDb(db)
}

export async function getProductById(id: string): Promise<UnifiedProduct | null> {
  const db = await readDb()
  return db.products.find(p => p.id === id) || null
}

export async function updateProduct(id: string, updates: Partial<UnifiedProduct>): Promise<UnifiedProduct | null> {
  const db = await readDb()
  const idx = db.products.findIndex(p => p.id === id)

  if (idx === -1) {
    return null
  }

  const existing = db.products[idx]
  const normalized = normalizeProduct({
    ...existing,
    ...updates,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  })

  db.products[idx] = normalized
  await writeDb(db)
  return normalized
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDb()
  const idx = db.products.findIndex(p => p.id === id)

  if (idx === -1) {
    return false
  }

  db.products.splice(idx, 1)
  await writeDb(db)
  return true
}

// Utility functions for database status
export function getDatabaseInfo() {
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

// Migration helper to copy data from file to KV
export async function migrateToKV(): Promise<{ success: boolean, message: string, count?: number }> {
  if (!hasKV) {
    return { success: false, message: 'Vercel KV not available' }
  }

  try {
    // Read from file
    const fileData = await fs.readFile(DB_PATH, "utf8")
    const fileDb = JSON.parse(fileData) as DbSchema

    // Write to KV
    await kv.set(KV_KEY, fileDb)

    return {
      success: true,
      message: `Successfully migrated ${fileDb.products.length} products to Vercel KV`,
      count: fileDb.products.length
    }
  } catch (error) {
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}