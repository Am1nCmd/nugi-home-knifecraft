import { NextResponse } from "next/server"
import { KNIVES } from "@/data/knives"

export async function GET() {
  return NextResponse.json(KNIVES)
}
