import { promises as fs } from "node:fs"
import path from "node:path"
import { PRODUCTS, type Product } from "@/data/products"

type DbSchema = { products: Product[] }

const DB_PATH = path.join(process.cwd(), "data", "products.db.json")

let writeLock = Promise.resolve()

async function ensureDb(): Promise<void> {
  try {
    await fs.access(DB_PATH)
  } catch {
    // init folder and file
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    const initial: DbSchema = { products: PRODUCTS }
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8")
  }
}

async function readDb(): Promise<DbSchema> {
  await ensureDb()
  const data = await fs.readFile(DB_PATH, "utf8")
  try {
    return JSON.parse(data) as DbSchema
  } catch {
    return { products: PRODUCTS }
  }
}

async function writeDb(next: DbSchema): Promise<void> {
  // serialize writes
  writeLock = writeLock.then(() => fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8"))
  return writeLock
}

export async function getProducts(): Promise<Product[]> {
  const db = await readDb()
  return db.products
}

function genId() {
  // simple unique id
  return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export async function addProduct(p: Partial<Product>) {
  const required = [
    "title",
    "price",
    "category",
    "image",
    "steel",
    "handleMaterial",
    "bladeLength",
    "handleLength",
    "bladeStyle",
    "handleStyle",
  ] as const
  for (const k of required) {
    if (p[k] === undefined || p[k] === null || (typeof p[k] === "string" && p[k].trim() === "")) {
      throw new Error("Data tidak lengkap.")
    }
  }
  const db = await readDb()
  const toSave: Product = {
    id: (p.id as string) || genId(),
    title: p.title as string,
    price: Number(p.price),
    category: p.category as Product["category"],
    image: p.image as string,
    steel: p.steel as string,
    handleMaterial: p.handleMaterial as string,
    bladeLength: Number(p.bladeLength),
    handleLength: Number(p.handleLength),
    bladeStyle: p.bladeStyle as string,
    handleStyle: p.handleStyle as string,
  }
  // upsert by id
  const idx = db.products.findIndex((x) => x.id === toSave.id)
  if (idx >= 0) db.products[idx] = toSave
  else db.products.push(toSave)
  await writeDb(db)
}

export async function addManyProducts(ps: Partial<Product>[]) {
  const db = await readDb()
  for (const p of ps) {
    const item: Product = {
      id: (p.id as string) || genId(),
      title: p.title as string,
      price: Number(p.price),
      category: p.category as Product["category"],
      image: p.image as string,
      steel: p.steel as string,
      handleMaterial: p.handleMaterial as string,
      bladeLength: Number(p.bladeLength),
      handleLength: Number(p.handleLength),
      bladeStyle: p.bladeStyle as string,
      handleStyle: p.handleStyle as string,
    }
    // validation minimal
    if (
      !item.title ||
      !Number.isFinite(item.price) ||
      !item.category ||
      !item.image ||
      !item.steel ||
      !item.handleMaterial ||
      !Number.isFinite(item.bladeLength) ||
      !Number.isFinite(item.handleLength) ||
      !item.bladeStyle ||
      !item.handleStyle
    ) {
      continue
    }
    const idx = db.products.findIndex((x) => x.id === item.id)
    if (idx >= 0) db.products[idx] = item
    else db.products.push(item)
  }
  await writeDb(db)
}
