export type ToolCategory = "Axe" | "Machete" | "Swords"

export type ToolProduct = {
  id: string
  title: string
  price: number // IDR
  category: ToolCategory
  images: string[] // multi-angle
  steel: string
  handleMaterial: string
  bladeLengthCm: number
  bladeThicknessMm: number
  handleLengthCm: number
  bladeStyle: string
  handleStyle: string
  weightGr?: number
  description?: string
  specs?: Record<string, string | number>
}

export const TOOLS: ToolProduct[] = [
  {
    id: "t1",
    title: "Forest Axe Medium",
    price: 820000,
    category: "Axe",
    images: ["/forest-axe-medium-front.jpg", "/forest-axe-medium-side.jpg"],
    steel: "1055",
    handleMaterial: "Hickory",
    bladeLengthCm: 11,
    bladeThicknessMm: 6,
    handleLengthCm: 50,
    bladeStyle: "Bearded",
    handleStyle: "Curved",
    weightGr: 950,
    description: "Kapur barus hickory, cocok untuk camping dan limbing.",
    specs: { Head: "Drop-forged", Sheath: "Leather" },
  },
  {
    id: "t2",
    title: "Tactical Tomahawk",
    price: 690000,
    category: "Axe",
    images: ["/tactical-tomahawk-front.jpg", "/tactical-tomahawk-detail.jpg"],
    steel: "3Cr13",
    handleMaterial: "FRN",
    bladeLengthCm: 9,
    bladeThicknessMm: 5,
    handleLengthCm: 38,
    bladeStyle: "Tomahawk",
    handleStyle: "Straight",
    weightGr: 720,
  },
  {
    id: "t3",
    title: 'Jungle Machete 18"',
    price: 540000,
    category: "Machete",
    images: ["/jungle-machete-18-front.jpg", "/jungle-machete-18-angle.jpg"],
    steel: "1075",
    handleMaterial: "PP",
    bladeLengthCm: 45,
    bladeThicknessMm: 2.5,
    handleLengthCm: 15,
    bladeStyle: "Latin",
    handleStyle: "Textured",
    weightGr: 520,
    specs: { Sheath: "Nylon" },
  },
  {
    id: "t4",
    title: 'Bolo Machete 16"',
    price: 580000,
    category: "Machete",
    images: ["/bolo-machete-16-front.jpg", "/bolo-machete-16-detail.jpg"],
    steel: "1055",
    handleMaterial: "Wood",
    bladeLengthCm: 40.5,
    bladeThicknessMm: 3,
    handleLengthCm: 14,
    bladeStyle: "Bolo",
    handleStyle: "Riveted",
    weightGr: 610,
  },
  {
    id: "t5",
    title: "Training Katana",
    price: 1250000,
    category: "Swords",
    images: ["/training-katana-front.jpg", "/training-katana-tsuba.jpg"],
    steel: "1060",
    handleMaterial: "Ray skin + Ito",
    bladeLengthCm: 72,
    bladeThicknessMm: 6,
    handleLengthCm: 28,
    bladeStyle: "Shinogi-zukuri",
    handleStyle: "Traditional",
    weightGr: 1150,
    specs: { Saya: "Wood lacquer", Hamon: "Simulated" },
  },
  {
    id: "t6",
    title: "European Arming Sword",
    price: 1490000,
    category: "Swords",
    images: ["/arming-sword-front.jpg", "/arming-sword-guard.jpg"],
    steel: "5160",
    handleMaterial: "Leather wrap",
    bladeLengthCm: 76,
    bladeThicknessMm: 5,
    handleLengthCm: 11,
    bladeStyle: "Straight double-edge",
    handleStyle: "One-handed",
    weightGr: 1050,
    specs: { Pommel: "Wheel", Fuller: "Central" },
  },
  {
    id: "t7",
    title: "Camp Hatchet Small",
    price: 390000,
    category: "Axe",
    images: ["/camp-hatchet-small-front.jpg", "/camp-hatchet-small-side.jpg"],
    steel: "1045",
    handleMaterial: "Ash",
    bladeLengthCm: 7.5,
    bladeThicknessMm: 4,
    handleLengthCm: 32,
    bladeStyle: "Hatchet",
    handleStyle: "Curved",
    weightGr: 520,
  },
  {
    id: "t8",
    title: "Falchion Light",
    price: 990000,
    category: "Swords",
    images: ["/falchion-light-front.jpg", "/placeholder.svg?height=320&width=480"],
    steel: "1065",
    handleMaterial: "Wood wrap",
    bladeLengthCm: 70,
    bladeThicknessMm: 4.2,
    handleLengthCm: 12,
    bladeStyle: "Single-edge curved",
    handleStyle: "Simple",
    weightGr: 980,
  },
]

// helpers
export const TOOL_CATEGORIES: ToolCategory[] = ["Axe", "Machete", "Swords"]

export const TOOL_FILTER_META = (() => {
  const prices = TOOLS.map((p) => p.price)
  const bladeLens = TOOLS.map((p) => p.bladeLengthCm)
  const steels = Array.from(new Set(TOOLS.map((p) => p.steel))).sort()
  const handles = Array.from(new Set(TOOLS.map((p) => p.handleMaterial))).sort()
  return {
    price: { min: Math.min(...prices), max: Math.max(...prices) },
    bladeLength: { min: Math.min(...bladeLens), max: Math.max(...bladeLens) },
    steels,
    handles,
  }
})()
