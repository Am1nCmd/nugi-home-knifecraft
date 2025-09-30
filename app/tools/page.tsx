import { redirect } from "next/navigation"

export default function ToolsPage() {
  redirect("/products?type=tool")
}
