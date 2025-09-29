import AdminLoginForm from "@/components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <section className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-balance">Panel Admin</h1>
          <p className="text-sm text-muted-foreground">Silakan login untuk melanjutkan.</p>
        </div>
        <AdminLoginForm />
      </section>
    </main>
  )
}
