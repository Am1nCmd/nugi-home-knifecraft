import { NextResponse } from "next/server"
import { getKnives } from "@/lib/store"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const { id } = ctx.params
    const knives = await getKnives()
    const item = knives.find((k) => k.id === id)
    if (!item) return new NextResponse("Not Found", { status: 404 })
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching knife:", error)
    return NextResponse.json({ error: "Failed to fetch knife" }, { status: 500 })
  }
}
