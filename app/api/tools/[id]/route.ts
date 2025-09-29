import { NextResponse } from "next/server"
import { TOOLS } from "@/data/tools"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = TOOLS.find((p) => p.id === params.id)
  if (!item) return new NextResponse("Not Found", { status: 404 })
  return NextResponse.json(item)
}
