export type KnifeCategory = "Tactical" | "Bushcraft" | "Kitchen" | "Butcher"

export type KnifeProduct = {
  id: string
  title: string
  price: number // in IDR
  category: KnifeCategory
  images: string[] // multi-angle images
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

export const KNIVES: KnifeProduct[] = [
  {
    id: "k1",
    title: "Tactical Tanto X",
    price: 850000,
    category: "Tactical",
    images: ["/tactical-tanto-knife-front.jpg", "/tactical-tanto-knife-side.jpg", "/tactical-tanto-knife-detail.jpg"],
    steel: "D2",
    handleMaterial: "G10",
    bladeLengthCm: 12,
    bladeThicknessMm: 4,
    handleLengthCm: 12,
    bladeStyle: "Tanto",
    handleStyle: "Textured",
    weightGr: 210,
    description: "Pisau taktis dengan bilah Tanto, cocok untuk outdoor dan kebutuhan taktis.",
    specs: { Sarung: "Kydex", Finishing: "Stonewashed" },
  },
  {
    id: "k2",
    title: "Bushcraft Scout",
    price: 690000,
    category: "Bushcraft",
    images: ["/bushcraft-knife-front.jpg", "/bushcraft-knife-top.jpg"],
    steel: "1095",
    handleMaterial: "Micarta",
    bladeLengthCm: 10,
    bladeThicknessMm: 3.5,
    handleLengthCm: 11.5,
    bladeStyle: "Scandi",
    handleStyle: "Contoured",
    weightGr: 190,
    description: "Pisau bushcraft dengan grind Scandi untuk feather stick dan carving.",
    specs: { Sarung: "Leather", Finishing: "Satin" },
  },
  {
    id: "k3",
    title: 'Chef Pro 8"',
    price: 920000,
    category: "Kitchen",
    images: ["/chef-knife-8-inch-front.jpg", "/chef-knife-8-inch-angle.jpg"],
    steel: "X50CrMoV15",
    handleMaterial: "Pakkawood",
    bladeLengthCm: 20,
    bladeThicknessMm: 2.2,
    handleLengthCm: 12,
    bladeStyle: "Chef",
    handleStyle: "Riveted",
    weightGr: 230,
    description: "Pisau dapur serbaguna 8 inci untuk slicing, dicing, dan chopping.",
    specs: { Bolster: "Full", Balance: "Tengah" },
  },
  {
    id: "k4",
    title: "Butcher Cleaver M",
    price: 780000,
    category: "Butcher",
    images: ["/butcher-cleaver-front.jpg", "/butcher-cleaver-detail.jpg"],
    steel: "5Cr15MoV",
    handleMaterial: "Composite",
    bladeLengthCm: 18,
    bladeThicknessMm: 4.5,
    handleLengthCm: 12.5,
    bladeStyle: "Cleaver",
    handleStyle: "Rounded",
    weightGr: 360,
    description: "Golok daging dengan kekuatan dan ketajaman seimbang.",
    specs: { Hole: "Hanging Hole", Edge: "Convex" },
  },
  {
    id: "k5",
    title: "Tactical Drop EDC",
    price: 540000,
    category: "Tactical",
    images: ["/tactical-drop-point-edc-front.jpg", "/tactical-drop-point-edc-clip.jpg"],
    steel: "8Cr13MoV",
    handleMaterial: "Aluminum",
    bladeLengthCm: 8,
    bladeThicknessMm: 2.8,
    handleLengthCm: 10.5,
    bladeStyle: "Drop Point",
    handleStyle: "Slim",
    weightGr: 140,
    description: "Pisau EDC ringan dengan clip pocket, cocok harian.",
  },
  {
    id: "k6",
    title: "Bushcraft Companion",
    price: 610000,
    category: "Bushcraft",
    images: ["/bushcraft-companion-front.jpg", "/bushcraft-companion-spine.jpg"],
    steel: "A2",
    handleMaterial: "Birch",
    bladeLengthCm: 9.5,
    bladeThicknessMm: 3,
    handleLengthCm: 11,
    bladeStyle: "Puukko",
    handleStyle: "Oval",
    weightGr: 175,
  },
  {
    id: "k7",
    title: 'Santoku 7"',
    price: 760000,
    category: "Kitchen",
    images: ["/santoku-7-inch-front.jpg", "/santoku-7-inch-kullenschliff.jpg"],
    steel: "AUS-8",
    handleMaterial: "POM",
    bladeLengthCm: 18,
    bladeThicknessMm: 2.1,
    handleLengthCm: 12,
    bladeStyle: "Santoku",
    handleStyle: "Ergonomic",
    weightGr: 210,
  },
  {
    id: "k8",
    title: "Butcher Boning Flex",
    price: 680000,
    category: "Butcher",
    images: ["/placeholder.svg?height=320&width=480", "/placeholder.svg?height=320&width=480"],
    steel: "4116",
    handleMaterial: "TPR",
    bladeLengthCm: 15,
    bladeThicknessMm: 2,
    handleLengthCm: 12,
    bladeStyle: "Boning",
    handleStyle: "Non-slip",
    weightGr: 160,
  },
  {
    id: "k9",
    title: 'Petty 5"',
    price: 430000,
    category: "Kitchen",
    images: ["/placeholder.svg?height=320&width=480"],
    steel: "VG10",
    handleMaterial: "Walnut",
    bladeLengthCm: 13,
    bladeThicknessMm: 1.8,
    handleLengthCm: 11,
    bladeStyle: "Petty",
    handleStyle: "Octagonal",
    weightGr: 110,
  },
  {
    id: "k10",
    title: "Tactical Rescue",
    price: 990000,
    category: "Tactical",
    images: ["/placeholder.svg?height=320&width=480", "/placeholder.svg?height=320&width=480"],
    steel: "440C",
    handleMaterial: "G10",
    bladeLengthCm: 11,
    bladeThicknessMm: 3.2,
    handleLengthCm: 12,
    bladeStyle: "Sheepsfoot",
    handleStyle: "Textured",
    weightGr: 205,
  },
]

// helpers to derive ranges/options
export const KNIFE_CATEGORIES: KnifeCategory[] = ["Tactical", "Bushcraft", "Kitchen", "Butcher"]

export const KNIFE_FILTER_META = (() => {
  const prices = KNIVES.map((k) => k.price)
  const bladeLens = KNIVES.map((k) => k.bladeLengthCm)
  const steels = Array.from(new Set(KNIVES.map((k) => k.steel))).sort()
  const handles = Array.from(new Set(KNIVES.map((k) => k.handleMaterial))).sort()
  return {
    price: { min: Math.min(...prices), max: Math.max(...prices) },
    bladeLength: { min: Math.min(...bladeLens), max: Math.max(...bladeLens) },
    steels,
    handles,
  }
})()
