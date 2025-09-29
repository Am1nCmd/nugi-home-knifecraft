"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package } from "lucide-react"
import { CATEGORIES } from "@/data/products"

export default function AdminProductForm() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [steel, setSteel] = useState("")
  const [handleMaterial, setHandleMaterial] = useState("")
  const [bladeLength, setBladeLength] = useState<string>("")
  const [handleLength, setHandleLength] = useState<string>("")
  const [bladeStyle, setBladeStyle] = useState("")
  const [handleStyle, setHandleStyle] = useState("")

  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      let image = imageUrl.trim()
      if (imageFile) {
        image = await fileToDataUrl(imageFile)
      }
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: Number(price),
          category,
          image,
          steel,
          handleMaterial,
          bladeLength: Number(bladeLength),
          handleLength: Number(handleLength),
          bladeStyle,
          handleStyle,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data?.error || "Gagal menambahkan produk.")
      } else {
        setMsg(data?.message || "Produk berhasil ditambahkan.")
        // reset
        setTitle("")
        setPrice("")
        setCategory("")
        setImageUrl("")
        setImageFile(null)
        setSteel("")
        setHandleMaterial("")
        setBladeLength("")
        setHandleLength("")
        setBladeStyle("")
        setHandleStyle("")
      }
    } catch {
      setMsg("Terjadi kesalahan jaringan.")
    } finally {
      setLoading(false)
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <Card className="w-full bg-zinc-800/50 border-zinc-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
            <Package className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <CardTitle className="text-balance text-white">Tambah Produk</CardTitle>
            <CardDescription className="text-zinc-400">Tambahkan produk baru secara manual</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-zinc-200">Judul</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pisau Baru"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price" className="text-zinc-200">Harga</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="150000"
              inputMode="numeric"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-zinc-200">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="steel" className="text-zinc-200">Bahan Baja</Label>
            <Input
              id="steel"
              value={steel}
              onChange={(e) => setSteel(e.target.value)}
              placeholder="D2 / AUS-8 / ..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="handleMaterial" className="text-zinc-200">Bahan Gagang</Label>
            <Input
              id="handleMaterial"
              value={handleMaterial}
              onChange={(e) => setHandleMaterial(e.target.value)}
              placeholder="G10 / Kayu / ..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bladeLength" className="text-zinc-200">Panjang Bilah (cm)</Label>
            <Input
              id="bladeLength"
              value={bladeLength}
              onChange={(e) => setBladeLength(e.target.value)}
              placeholder="10"
              inputMode="numeric"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="handleLength" className="text-zinc-200">Panjang Gagang (cm)</Label>
            <Input
              id="handleLength"
              value={handleLength}
              onChange={(e) => setHandleLength(e.target.value)}
              placeholder="12"
              inputMode="numeric"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bladeStyle" className="text-zinc-200">Model Bilah</Label>
            <Input
              id="bladeStyle"
              value={bladeStyle}
              onChange={(e) => setBladeStyle(e.target.value)}
              placeholder="Drop Point / Tanto / ..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="handleStyle" className="text-zinc-200">Model Gagang</Label>
            <Input
              id="handleStyle"
              value={handleStyle}
              onChange={(e) => setHandleStyle(e.target.value)}
              placeholder="Ergonomic / Slim / ..."
              required
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label className="text-zinc-200">Foto Produk</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            <div className="text-xs text-zinc-400">Atau masukkan URL gambar</div>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/pisau-premium-di-atas-meja-kayu.jpg atau https://..."
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </div>
          {msg ? <p className="text-sm md:col-span-2 text-zinc-300">{msg}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
