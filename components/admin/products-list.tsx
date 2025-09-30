"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Eye, Package } from "lucide-react"
import { UnifiedProduct } from "@/data/unified-products"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatPriceIDR(amount: number) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
  } catch {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }
}

export default function ProductsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<UnifiedProduct | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { data, error, isLoading, mutate } = useSWR("/api/products/unified", fetcher)

  const products = data?.products || []

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product: UnifiedProduct) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || product.type === typeFilter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      return matchesSearch && matchesType && matchesCategory
    })
  }, [products, searchTerm, typeFilter, categoryFilter])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(products.map((p: UnifiedProduct) => p.category))
    return Array.from(cats).sort()
  }, [products])

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/admin/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete.id })
      })

      if (response.ok) {
        mutate() // Refresh the data
        setDeleteDialogOpen(false)
        setProductToDelete(null)
      } else {
        console.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">Gagal memuat produk</p>
            <p className="text-zinc-500 text-sm mt-2">Silakan coba lagi nanti</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Package className="w-6 h-6" />
          Daftar Produk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-zinc-700/50 border-zinc-600/50 text-white">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="knife">Pisau</SelectItem>
              <SelectItem value="tool">Tools</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-zinc-700/50 border-zinc-600/50 text-white">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center text-sm text-zinc-400">
            {filteredProducts.length} dari {products.length} produk
          </div>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-zinc-700/50 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-zinc-700/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-700/30">
                <TableRow className="border-zinc-700/50">
                  <TableHead className="text-zinc-300">Produk</TableHead>
                  <TableHead className="text-zinc-300">Tipe</TableHead>
                  <TableHead className="text-zinc-300">Kategori</TableHead>
                  <TableHead className="text-zinc-300">Harga</TableHead>
                  <TableHead className="text-zinc-300">Spesifikasi</TableHead>
                  <TableHead className="text-zinc-300 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: UnifiedProduct) => (
                  <TableRow key={product.id} className="border-zinc-700/50 hover:bg-zinc-700/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-700"
                        />
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-zinc-400 text-sm">{product.steel}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.type === "knife"
                            ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                            : "bg-green-600/20 text-green-400 border-green-600/30"
                        }
                      >
                        {product.type === "knife" ? "Pisau" : "Tools"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-amber-600/30 bg-amber-600/10 text-amber-400">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {formatPriceIDR(product.price)}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {product.bladeLengthCm}cm • {product.handleMaterial}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          onClick={() => {
                            setProductToDelete(product)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-lg">Tidak ada produk yang ditemukan</p>
            <p className="text-zinc-500 text-sm mt-2">Coba ubah filter atau tambah produk baru</p>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-800 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Hapus Produk</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Apakah Anda yakin ingin menghapus produk "{productToDelete?.title}"?
              Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}