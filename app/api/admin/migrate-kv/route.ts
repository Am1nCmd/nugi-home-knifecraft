import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { migrateToKV, getDatabaseInfo } from "@/lib/store-production"

export async function POST(req: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbInfo = getDatabaseInfo()
    if (!dbInfo.hasKV) {
      return NextResponse.json({
        error: "Vercel KV not configured. Please set up KV_REST_API_URL and KV_REST_API_TOKEN environment variables."
      }, { status: 400 })
    }

    const result = await migrateToKV()

    return NextResponse.json({
      success: result.success,
      message: result.message,
      count: result.count,
      databaseInfo: getDatabaseInfo()
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({
      error: `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`
    }, { status: 500 })
  }
}