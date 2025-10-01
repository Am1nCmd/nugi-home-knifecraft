import { NextResponse } from "next/server"
import { getTools } from "@/lib/store-production"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const tools = await getTools()
    const item = tools.find((p) => p.id === params.id)
    if (!item) return new NextResponse("Not Found", { status: 404 })
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching tool:", error)
    return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
  }
}
