import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getArticleById, updateArticle, deleteArticle } from "@/lib/articles-production"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await getArticleById(params.id)

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Auto-capture updater information from session
    const updaterInfo = {
      email: session.user.email!,
      name: session.user.name || session.user.email!
    }

    // Add updater attribution to article data
    const articleData = {
      ...body,
      updatedBy: updaterInfo,
      updatedAt: new Date().toISOString()
    }

    const article = await updateArticle(params.id, articleData)

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error updating article:", error)
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const success = await deleteArticle(params.id)

    if (!success) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}