import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getArticles, getArticlesByType, addArticle } from "@/lib/articles-production"
import { ArticleType } from "@/data/articles"

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as ArticleType | null
    const maker = searchParams.get("maker") // Filter by maker email or name

    let articles
    if (type && ["news", "knowledge", "blog"].includes(type)) {
      articles = await getArticlesByType(type)
    } else {
      articles = await getArticles()
    }

    // Apply maker filter if specified
    if (maker && maker !== "all") {
      articles = articles.filter(article => {
        // Check both createdBy and updatedBy for maker match
        const createdByMatch = article.createdBy?.email === maker || article.createdBy?.name === maker
        const updatedByMatch = article.updatedBy?.email === maker || article.updatedBy?.name === maker
        return createdByMatch || updatedByMatch
      })
    }

    return NextResponse.json({
      articles,
      total: articles.length,
      filters: {
        type,
        maker
      }
    })
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

    // Auto-capture maker information from session
    const makerInfo = {
      email: session.user.email!,
      name: session.user.name || session.user.email!
    }

    // Comprehensive validation with detailed error messages
    const missingFields: string[] = []

    // Basic required fields for all article types
    if (!body?.title?.trim()) missingFields.push("Judul")
    if (!body?.excerpt?.trim()) missingFields.push("Ringkasan")

    // Validate article type
    const validTypes: ArticleType[] = ["news", "knowledge", "blog"]
    if (!body?.type || !validTypes.includes(body.type)) {
      missingFields.push(`Tipe Artikel (pilih salah satu: ${validTypes.join(", ")})`)
    }

    // Type-specific validation
    if (body.type === "blog") {
      // Blog articles should have content, publishDate, and readTime
      if (!body?.content?.trim()) missingFields.push("Konten Lengkap (wajib untuk artikel blog)")
      if (!body?.publishDate?.trim()) missingFields.push("Tanggal Publikasi (wajib untuk artikel blog)")
      if (!body?.readTime?.trim()) missingFields.push("Waktu Baca (wajib untuk artikel blog)")
    }

    // Type-specific media requirements
    if (body.type === "knowledge") {
      // Knowledge articles should have an icon
      if (!body?.icon?.trim()) missingFields.push("Ikon (wajib untuk artikel ilmu pengetahuan)")
    } else {
      // News and blog articles should have an image
      if (!body?.image?.trim()) missingFields.push("URL Gambar (wajib untuk artikel berita dan blog)")
    }

    // Return validation errors if any
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Data tidak lengkap. Field yang kurang: ${missingFields.join(", ")}`
      }, { status: 400 })
    }

    // Prepare validated article data
    const articleData = {
      ...body,
      type: body.type as ArticleType,
      title: body.title.trim(),
      excerpt: body.excerpt.trim(),
      content: body.content?.trim() || "",
      image: body.image?.trim() || "",
      icon: body.icon?.trim() || "",
      publishDate: body.publishDate?.trim() || "",
      readTime: body.readTime?.trim() || "",
      createdBy: makerInfo,
      updatedBy: makerInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const article = await addArticle(articleData)

    return NextResponse.json({
      success: true,
      message: `Artikel "${body.title}" berhasil ditambahkan oleh ${makerInfo.name}`,
      article
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({
      error: `Gagal menambahkan artikel: ${error instanceof Error ? error.message : "Error tidak dikenal"}`
    }, { status: 500 })
  }
}