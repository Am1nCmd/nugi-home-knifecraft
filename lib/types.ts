export type Category = "Outdoor" | "Koleksi" | "Dapur" | "Survival" | "Lainnya"

export interface Product {
  id: string
  title: string
  price: number
  category: Category
  image: string // URL atau data URL base64
  bahanBaja?: string
  bahanGagang?: string
  panjangBilah?: number
  panjangGagang?: number
  modelBilah?: string
  modelGagang?: string
}
