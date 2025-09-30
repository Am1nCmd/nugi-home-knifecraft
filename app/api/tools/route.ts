import { NextResponse } from "next/server"
import { getTools } from "@/lib/store"

export async function GET() {
  try {
    const tools = await getTools()
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}
