import { NextResponse } from "next/server"
import { getKnives } from "@/lib/store"

export async function GET() {
  try {
    const knives = await getKnives()
    return NextResponse.json(knives)
  } catch (error) {
    console.error("Error fetching knives:", error)
    return NextResponse.json({ error: "Failed to fetch knives" }, { status: 500 })
  }
}
