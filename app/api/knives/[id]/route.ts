import { NextResponse } from "next/server"
import { KNIVES } from "@/data/knives"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params
  const item = KNIVES.find((k) => k.id === id)
  if (!item) return new NextResponse("Not Found", { status: 404 })
  return NextResponse.json(item)
}
