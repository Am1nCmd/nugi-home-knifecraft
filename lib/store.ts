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

let writeLock = Promise.resolve()

async function ensureDb(): Promise<void> {
  try {
    await fs.access(DB_PATH)
  } catch {
    // init folder and file
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    const initial: DbSchema = {
      products: [],
      metadata: {
        version: "2.0",
        createdAt: new Date().toISOString(),
        totalProducts: 0,
        productTypes: { knives: 0, tools: 0 }
      }
    }
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8")
  }
}

async function readDb(): Promise<DbSchema> {
  await ensureDb()
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

  // serialize writes
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
