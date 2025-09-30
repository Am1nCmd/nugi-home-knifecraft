import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getArticles, getArticlesByType, addArticle } from "@/lib/articles"
import { ArticleType } from "@/data/articles"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as ArticleType | null

    let articles
    if (type && ["news", "knowledge", "blog"].includes(type)) {
      articles = await getArticlesByType(type)
    } else {
      articles = await getArticles()
    }

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const article = await addArticle(body)

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}