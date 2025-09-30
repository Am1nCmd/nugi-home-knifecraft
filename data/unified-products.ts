// Unified Product Database Structure
export type ProductType = "knife" | "tool"

export type KnifeCategory = "Tactical" | "Bushcraft" | "Kitchen" | "Butcher"
export type ToolCategory = "Axe" | "Machete" | "Swords"

// Maker information type
export type MakerInfo = {
  email: string
  name: string
}

export type UnifiedProduct = {
  id: string
  title: string
  price: number // in IDR
  type: ProductType
  category: KnifeCategory | ToolCategory
  images: string[] // multi-angle images (first image is primary)
  steel: string
  handleMaterial: string

  // Dimensions
  bladeLengthCm: number
  handleLengthCm: number
  bladeThicknessMm?: number
  weightGr?: number

  // Styles
  bladeStyle: string
  handleStyle: string

  // Optional enhanced fields
  description?: string
  specs?: Record<string, string | number>

  // Legacy compatibility
  image?: string // For backward compatibility, maps to images[0]

  // Metadata
  createdAt?: string
  updatedAt?: string

  // Maker attribution
  createdBy?: MakerInfo
  updatedBy?: MakerInfo
}

// Helper type for legacy products
export type LegacyProduct = {
  id: string
  title: string
  price: number
  category: string
  image: string
  steel: string
  handleMaterial: string
  bladeLength: number
  handleLength: number
  bladeStyle: string
  handleStyle: string
}

// Category mappings
export const KNIFE_CATEGORIES: KnifeCategory[] = ["Tactical", "Bushcraft", "Kitchen", "Butcher"]
export const TOOL_CATEGORIES: ToolCategory[] = ["Axe", "Machete", "Swords"]
export const ALL_CATEGORIES = [...KNIFE_CATEGORIES, ...TOOL_CATEGORIES]

// Legacy category mapping for backward compatibility
export const LEGACY_CATEGORY_MAP: Record<string, { type: ProductType, category: KnifeCategory | ToolCategory }> = {
  "Outdoor": { type: "knife", category: "Tactical" },
  "Koleksi": { type: "knife", category: "Kitchen" },
  "Dapur": { type: "knife", category: "Kitchen" },
  "Survival": { type: "knife", category: "Bushcraft" },
}

// Helper functions
export function isKnifeCategory(category: string): category is KnifeCategory {
  return KNIFE_CATEGORIES.includes(category as KnifeCategory)
}

export function isToolCategory(category: string): category is ToolCategory {
  return TOOL_CATEGORIES.includes(category as ToolCategory)
}

export function getProductType(category: string): ProductType {
  if (isKnifeCategory(category)) return "knife"
  if (isToolCategory(category)) return "tool"

  // Fallback to legacy mapping
  const legacy = LEGACY_CATEGORY_MAP[category]
  return legacy?.type || "knife"
}

export function normalizeProduct(product: any): UnifiedProduct {
  // Determine product type and category
  const type = getProductType(product.category)
  let category = product.category

  // Map legacy categories
  if (LEGACY_CATEGORY_MAP[product.category]) {
    category = LEGACY_CATEGORY_MAP[product.category].category
  }

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    type,
    category: category as KnifeCategory | ToolCategory,
    images: product.images || (product.image ? [product.image] : []),
    steel: product.steel,
    handleMaterial: product.handleMaterial,
    bladeLengthCm: product.bladeLengthCm || product.bladeLength || 0,
    handleLengthCm: product.handleLengthCm || product.handleLength || 0,
    bladeThicknessMm: product.bladeThicknessMm,
    weightGr: product.weightGr,
    bladeStyle: product.bladeStyle,
    handleStyle: product.handleStyle,
    description: product.description,
    specs: product.specs,
    image: product.images?.[0] || product.image, // Backward compatibility
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
    // Preserve maker information
    createdBy: product.createdBy,
    updatedBy: product.updatedBy,
  }
}

export function toLegacyProduct(product: UnifiedProduct): LegacyProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.images[0] || "",
    steel: product.steel,
    handleMaterial: product.handleMaterial,
    bladeLength: product.bladeLengthCm,
    handleLength: product.handleLengthCm,
    bladeStyle: product.bladeStyle,
    handleStyle: product.handleStyle,
  }
}