"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!file) {
      setMsg("Pilih file CSV terlebih dahulu.")
      return
    }
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: form,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data?.error || "Gagal mengunggah CSV.")
      } else {
        setMsg(`Berhasil mengimpor ${data?.count ?? 0} produk.`)
        setFile(null)
      }
    } catch {
      setMsg("Terjadi kesalahan jaringan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-balance">Impor CSV</CardTitle>
        <CardDescription>
          Header yang didukung: image/foto, title/judul, price/harga, category/kategori, steel/bahan baja,
          handleMaterial/bahan gagang, bladeLength/panjang bilah, handleLength/panjang gagang, bladeStyle/model bilah,
          handleStyle/model gagang.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button type="submit" disabled={loading}>
            {loading ? "Mengunggah..." : "Unggah CSV"}
          </Button>
          {msg ? <p className="text-sm">{msg}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
