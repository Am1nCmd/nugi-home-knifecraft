import { redirect } from "next/navigation"

export default function KnivesPage() {
  redirect("/products?type=knife")
}
