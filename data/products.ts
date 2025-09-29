export type ProductCategory = "Outdoor" | "Koleksi" | "Dapur" | "Survival"
export type Product = {
  id: string
  title: string
  price: number
  category: ProductCategory
  image: string
  steel: string
  handleMaterial: string
  bladeLength: number // cm
  handleLength: number // cm
  bladeStyle: string
  handleStyle: string
}

export const CATEGORIES: ProductCategory[] = ["Outdoor", "Koleksi", "Dapur", "Survival"]

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Pisau Lipat Taktis X1",
    price: 350000,
    category: "Outdoor",
    image: "/pisau-lipat-taktis-outdoor.jpg",
    steel: "D2",
    handleMaterial: "G10",
    bladeLength: 9,
    handleLength: 11,
    bladeStyle: "Drop Point",
    handleStyle: "Ergonomic",
  },
  {
    id: "p2",
    title: 'Chef Knife Pro 8"',
    price: 720000,
    category: "Dapur",
    image: "/pisau-dapur-chef-8-inci.jpg",
    steel: "X50CrMoV15",
    handleMaterial: "Pakkawood",
    bladeLength: 20,
    handleLength: 12,
    bladeStyle: "Chef",
    handleStyle: "Riveted",
  },
  {
    id: "p3",
    title: "Pisau Koleksi Damascus",
    price: 1850000,
    category: "Koleksi",
    image: "/pisau-damascus-koleksi.jpg",
    steel: "Damascus",
    handleMaterial: "Rosewood",
    bladeLength: 10,
    handleLength: 12,
    bladeStyle: "Clip Point",
    handleStyle: "Classic",
  },
  {
    id: "p4",
    title: "Pisau Survival Serbaguna",
    price: 560000,
    category: "Survival",
    image: "/pisau-survival-serbaguna.jpg",
    steel: "440C",
    handleMaterial: "Rubber",
    bladeLength: 12,
    handleLength: 12,
    bladeStyle: "Tanto",
    handleStyle: "Textured",
  },
  {
    id: "p5",
    title: 'Santoku Steel 7"',
    price: 640000,
    category: "Dapur",
    image: "/pisau-santoku-7-inci.jpg",
    steel: "AUS-8",
    handleMaterial: "Composite",
    bladeLength: 18,
    handleLength: 12,
    bladeStyle: "Santoku",
    handleStyle: "Rounded",
  },
  {
    id: "p6",
    title: "Pisau Lipat Compact",
    price: 290000,
    category: "Outdoor",
    image: "/pisau-lipat-compact.jpg",
    steel: "8Cr13MoV",
    handleMaterial: "Aluminum",
    bladeLength: 7,
    handleLength: 9,
    bladeStyle: "Sheepsfoot",
    handleStyle: "Slim",
  },
]
