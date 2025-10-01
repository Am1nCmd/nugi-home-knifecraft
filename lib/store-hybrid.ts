import { promises as fs } from "node:fs"
import path from "node:path"
import { UnifiedProduct, normalizeProduct, toLegacyProduct } from "@/data/unified-products"
import type { Product } from "@/data/products"

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

// Environment detection
const isProduction = process.env.NODE_ENV === 'production'
const isServerless = process.env.VERCEL || process.env.NETLIFY
const isReadOnlyEnvironment = isProduction && isServerless

// In-memory storage for read-only environments
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
  if (isReadOnlyEnvironment) {
    // In read-only environment, initialize memory store if not exists
    if (!memoryStore) {
      try {
        // Try to load from file if it exists (during build time)
        const data = await fs.readFile(DB_PATH, "utf8")
        memoryStore = JSON.parse(data) as DbSchema
      } catch {
        // Fall back to initial empty state
        memoryStore = await getInitialDb()
      }
    }
    return
  }

  // In development or writable environment
  try {
    await fs.access(DB_PATH)
  } catch {
    // Init folder and file
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    const initial = await getInitialDb()
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8")
  }
}

async function readDb(): Promise<DbSchema> {
  await ensureDb()

  if (isReadOnlyEnvironment) {
    if (!memoryStore) {
      memoryStore = await getInitialDb()
    }
    return memoryStore
  }

  // Read from file system
  const data = await fs.readFile(DB_PATH, "utf8")
  try {
    const parsed = JSON.parse(data) as DbSchema
    // Ensure metadata exists
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

  if (isReadOnlyEnvironment) {
    // In read-only environment, update memory store
    memoryStore = { ...next }
    console.warn('⚠️ Running in read-only environment. Product changes are temporary and will be lost on restart.')
    return
  }

  // serialize writes to file system
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
export async function getLegacyProducts(): Promise<Product[]> {
  const db = await readDb()
  return db.products.map(toLegacyProduct)
}

function genId(type: "knife" | "tool" = "knife") {
  // simple unique id with type prefix
  const prefix = type === "knife" ? "k_" : "t_"
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export async function addProduct(p: Partial<UnifiedProduct>) {
  const normalized = normalizeProduct(p)

  // Generate ID if not provided
  if (!normalized.id) {
    normalized.id = genId(normalized.type)
  }

  // Set timestamps
  normalized.updatedAt = new Date().toISOString()
  if (!normalized.createdAt) {
    normalized.createdAt = normalized.updatedAt
  }

  const db = await readDb()

  // upsert by id
  const idx = db.products.findIndex((x) => x.id === normalized.id)
  if (idx >= 0) {
    // Keep original createdAt for updates
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

      // Generate ID if not provided
      if (!normalized.id || normalized.id.trim() === '') {
        normalized.id = genId(normalized.type)
      }

      // Set timestamps
      normalized.updatedAt = timestamp
      if (!normalized.createdAt) {
        normalized.createdAt = timestamp
      }

      // Basic validation
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
        // Keep original createdAt for updates
        normalized.createdAt = db.products[idx].createdAt
        db.products[idx] = normalized
      } else {
        db.products.push(normalized)
      }
    } catch (error) {
      // Skip invalid products
      console.warn(`Skipping invalid product:`, error)
      continue
    }
  }

  await writeDb(db)
}

// Get individual product by ID
export async function getProductById(id: string): Promise<UnifiedProduct | null> {
  const db = await readDb()
  return db.products.find(p => p.id === id) || null
}

// Update existing product
export async function updateProduct(id: string, updates: Partial<UnifiedProduct>): Promise<UnifiedProduct | null> {
  const db = await readDb()
  const idx = db.products.findIndex(p => p.id === id)

  if (idx === -1) {
    return null // Product not found
  }

  const existing = db.products[idx]
  const normalized = normalizeProduct({
    ...existing,
    ...updates,
    id, // Ensure ID doesn't change
    createdAt: existing.createdAt, // Preserve original creation date
    updatedAt: new Date().toISOString()
  })

  db.products[idx] = normalized
  await writeDb(db)
  return normalized
}

// Delete product by ID
export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDb()
  const idx = db.products.findIndex(p => p.id === id)

  if (idx === -1) {
    return false // Product not found
  }

  db.products.splice(idx, 1)
  await writeDb(db)
  return true
}

// Utility functions for database status
export function getDatabaseInfo() {
  return {
    environment: isProduction ? 'production' : 'development',
    isServerless: isServerless,
    isReadOnly: isReadOnlyEnvironment,
    storageType: isReadOnlyEnvironment ? 'memory' : 'file',
    dbPath: isReadOnlyEnvironment ? 'in-memory' : DB_PATH,
    persistent: !isReadOnlyEnvironment
  }
}

export function isReadOnlyMode(): boolean {
  return isReadOnlyEnvironment
}