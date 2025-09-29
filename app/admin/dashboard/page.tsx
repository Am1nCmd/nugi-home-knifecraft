import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getCookieName, verifySessionValue } from "@/lib/session"
import AdminProductForm from "@/components/admin-product-form"
import CsvUpload from "@/components/csv-upload"

export default async function AdminDashboardPage() {
  const session = verifySessionValue(cookies().get(getCookieName())?.value)
  if (!session) {
    redirect("/admin/login")
  }

  return (
    <main className="min-h-dvh p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-balance">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Tambahkan produk baru atau impor dari CSV.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <AdminProductForm />
        <CsvUpload />
      </div>
    </main>
  )
}
