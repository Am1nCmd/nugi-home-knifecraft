import { promises as fs } from "fs"
import path from "path"
import type { Product, Category } from "@/lib/types"

const DB_DIR = path.join(process.cwd(), "data")
const DB_FILE = path.join(DB_DIR, "products.db.json")

async function ensureDB() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true })
    await fs.access(DB_FILE)
  } catch {
    const seed: Product[] = [
      {
        id: "p-1",
        title: "Pisau Lipat Taktis",
        price: 350000,
        category: "Outdoor",
        image: "/pisau-lipat-taktis.jpg",
        bahanBaja: "440C",
        bahanGagang: "G10",
        panjangBilah: 9,
        panjangGagang: 11,
        modelBilah: "Drop Point",
        modelGagang: "Ergonomis",
      },
      {
        id: "p-2",
        title: 'Pisau Chef 8"',
        price: 680000,
        category: "Dapur",
        image: "/pisau-chef-8-inci.jpg",
        bahanBaja: "X50CrMoV15",
        bahanGagang: "POM",
        panjangBilah: 20,
        panjangGagang: 12,
        modelBilah: "Chef",
        modelGagang: "Klasik",
      },
      {
        id: "p-3",
        title: "Pisau Damascus Koleksi",
        price: 1500000,
        category: "Koleksi",
        image: "/pisau-damascus-koleksi.jpg",
        bahanBaja: "Damascus",
        bahanGagang: "Rosewood",
        panjangBilah: 12,
        panjangGagang: 10,
        modelBilah: "Clip Point",
        modelGagang: "Tradisional",
      },
      {
        id: "p-4",
        title: "Pisau Survival Serbaguna",
        price: 790000,
        category: "Survival",
        image: "/pisau-survival-serbaguna.jpg",
        bahanBaja: "D2",
        bahanGagang: "Micarta",
        panjangBilah: 13,
        panjangGagang: 12,
        modelBilah: "Tanto",
        modelGagang: "Tekstur",
      },
      {
        id: "p-5",
        title: 'Santoku 7"',
        price: 620000,
        category: "Dapur",
        image: "/pisau-santoku-7-inci.jpg",
        bahanBaja: "AUS-8",
        bahanGagang: "Pakwood",
        panjangBilah: 18,
        panjangGagang: 12,
        modelBilah: "Santoku",
        modelGagang: "Oval",
      },
      {
        id: "p-6",
        title: "Pisau Outdoor Compact",
        price: 420000,
        category: "Outdoor",
        image: "/pisau-outdoor-compact.jpg",
        bahanBaja: "14C28N",
        bahanGagang: "FRN",
        panjangBilah: 8,
        panjangGagang: 10,
        modelBilah: "Sheepsfoot",
        modelGagang: "Ringkas",
      },
    ]
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf8")
  }
}

export async function readProducts(): Promise<Product[]> {
  await ensureDB()
  const raw = await fs.readFile(DB_FILE, "utf8")
  return JSON.parse(raw)
}

export async function writeProducts(list: Product[]) {
  await ensureDB()
  await fs.writeFile(DB_FILE, JSON.stringify(list, null, 2), "utf8")
}

export async function addProduct(p: Omit<Product, "id">): Promise<Product> {
  const list = await readProducts()
  const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const item: Product = { id, ...p }
  list.unshift(item)
  await writeProducts(list)
  return item
}

export async function importProducts(items: Omit<Product, "id">[]) {
  const list = await readProducts()
  const withIds: Product[] = items.map((p, i) => ({
    id: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 5)}`,
    ...p,
  }))
  // masukkan di awal
  const newList = [...withIds, ...list]
  await writeProducts(newList)
  return withIds.length
}

export const ALL_CATEGORIES: Category[] = ["Outdoor", "Koleksi", "Dapur", "Survival", "Lainnya"]
