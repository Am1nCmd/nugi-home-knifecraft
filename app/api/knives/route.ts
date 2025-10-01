import { NextResponse } from "next/server"
import { getKnives } from "@/lib/store-production"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const knives = await getKnives()
    return NextResponse.json(knives)
  } catch (error) {
    console.error("Error fetching knives:", error)
    return NextResponse.json({ error: "Failed to fetch knives" }, { status: 500 })
  }
}
