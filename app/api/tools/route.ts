import { NextResponse } from "next/server"
import { TOOLS } from "@/data/tools"

export async function GET() {
  return NextResponse.json(TOOLS)
}
