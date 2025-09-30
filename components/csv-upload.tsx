"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download } from "lucide-react"

type ImportMode = "append" | "update" | "replace"

export default function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [importMode, setImportMode] = useState<ImportMode>("append")

  async function onDownloadTemplate() {
    setDownloadLoading(true)
    try {
      const res = await fetch("/api/admin/products/export", {
        method: "GET",
      })
      if (!res.ok) {
        setMsg("Gagal mengunduh template.")
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `nugi-home-products-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setMsg("Template berhasil diunduh!")
    } catch (error) {
      setMsg("Terjadi kesalahan saat mengunduh template.")
    } finally {
      setDownloadLoading(false)
    }
  }

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
      form.append("mode", importMode)

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: form,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data?.error || "Gagal mengunggah CSV.")
      } else {
        setMsg(data?.message || `Import berhasil!`)
        setFile(null)
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch {
      setMsg("Terjadi kesalahan jaringan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600/20 rounded-lg">
            <Upload className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-balance text-white">Import CSV</CardTitle>
            <p className="text-sm text-zinc-400">Upload file CSV untuk import bulk</p>
          </div>
        </div>
        <CardDescription className="text-zinc-400">
          Header yang didukung: image/foto, title/judul, price/harga, category/kategori, steel/bahan baja,
          handleMaterial/bahan gagang, bladeLength/panjang bilah, handleLength/panjang gagang, bladeStyle/model bilah,
          handleStyle/model gagang.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Download Template Section */}
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-zinc-200">Step 1: Download Template</h3>
            <p className="text-xs text-zinc-400">Download database saat ini sebagai template CSV untuk diedit</p>
            <Button
              variant="outline"
              onClick={onDownloadTemplate}
              disabled={downloadLoading}
              className="flex items-center gap-2 border-amber-600/30 text-amber-400 hover:bg-amber-600/10"
            >
              <Download className="w-4 h-4" />
              {downloadLoading ? "Mengunduh..." : "Download Template CSV"}
            </Button>
          </div>

          {/* Upload Section */}
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-zinc-200">Step 2: Upload CSV</h3>

            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-xs text-zinc-400">Import Mode</label>
                <Select value={importMode} onValueChange={(value: ImportMode) => setImportMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="append">Append - Tambah produk baru saja (skip duplikat)</SelectItem>
                    <SelectItem value="update">Update - Update yang ada, tambah yang baru</SelectItem>
                    <SelectItem value="replace">Replace - Ganti semua dengan data CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              <Button type="submit" disabled={loading || !file}>
                <Upload className="w-4 h-4 mr-2" />
                {loading ? "Mengimpor..." : "Import CSV"}
              </Button>
            </form>
          </div>

          {/* Message Display */}
          {msg && (
            <div className={`p-3 rounded-md text-sm ${
              msg.includes("berhasil") || msg.includes("Template berhasil")
                ? "bg-green-900/20 border border-green-700/30 text-green-400"
                : "bg-red-900/20 border border-red-700/30 text-red-400"
            }`}>
              {msg}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
