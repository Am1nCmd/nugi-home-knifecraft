import { NextResponse } from "next/server"
import { getTools } from "@/lib/store-production"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const tools = await getTools()
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}
