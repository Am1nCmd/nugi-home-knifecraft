"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Article } from "@/data/articles"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const fallbackArticles = [
  {
    id: 1,
    title: "Kisah Dibalik Pembuatan Pisau Dapur Tradisional",
    content: `
      <p>Pembuatan pisau dapur tradisional adalah seni yang telah diwariskan turun-temurun selama berabad-abad. Setiap langkah dalam prosesnya memiliki makna dan presisi tinggi yang tidak dapat diabaikan.</p>
      
      <h2>Awal Mula Tradisi</h2>
      <p>Tradisi pembuatan pisau dimulai dari pemilihan bahan baku yang tepat. Para pandai besi tradisional menggunakan baja karbon tinggi yang dikenal memiliki ketajaman superior dan daya tahan yang luar biasa.</p>
      
      <h2>Proses Pemanasan dan Pembentukan</h2>
      <p>Proses pembentukan bilah pisau memerlukan keahlian khusus. Baja dipanaskan hingga mencapai suhu optimal, kemudian ditempa berulang kali untuk mencapai bentuk dan struktur yang diinginkan. Setiap pukulan palu memiliki tujuan spesifik dalam membentuk karakter pisau.</p>
      
      <h2>Pengasahan dan Finishing</h2>
      <p>Tahap akhir adalah pengasahan manual yang memakan waktu berjam-jam. Proses ini menghasilkan ketajaman luar biasa yang menjadi ciri khas pisau tradisional berkualitas tinggi.</p>
      
      <p>Setiap pisau yang dihasilkan bukan sekadar alat, tetapi karya seni yang mencerminkan dedikasi dan keahlian sang pembuatnya.</p>
    `,
    thumbnail: "/knife-maker-community-event.jpg",
    publishDate: "15 Januari 2025",
    readTime: "8 menit",
    author: "Tim Nugi Home Knifecraft"
  },
  {
    id: 2,
    title: "Proses Heat Treatment: Rahasia Ketajaman Pisau",
    content: `
      <p>Heat treatment adalah proses krusial yang menentukan kualitas akhir sebuah pisau. Proses ini melibatkan pemanasan dan pendinginan baja dengan kontrol suhu yang sangat presisi.</p>
      
      <h2>Tahap Quenching</h2>
      <p>Quenching adalah proses pendinginan cepat baja dari suhu tinggi. Media pendingin yang digunakan bisa berupa air, minyak, atau udara tergantung jenis baja yang digunakan. Proses ini mengubah struktur kristal baja menjadi lebih keras.</p>
      
      <h2>Tempering untuk Ketangguhan</h2>
      <p>Setelah quenching, baja menjadi sangat keras namun rapuh. Tempering adalah proses pemanasan ulang pada suhu lebih rendah untuk mengurangi kerapuhan sambil mempertahankan kekerasan yang diinginkan.</p>
      
      <h2>Kontrol Suhu yang Presisi</h2>
      <p>Setiap jenis baja memiliki temperatur optimal untuk heat treatment. Perbedaan beberapa derajat saja dapat menghasilkan hasil yang sangat berbeda dalam hal kekerasan dan ketangguhan.</p>
      
      <p>Memahami dan menguasai proses heat treatment adalah kunci untuk menghasilkan pisau berkualitas tinggi yang tajam dan tahan lama.</p>
    `,
    thumbnail: "/knife-maintenance-sharpening-guide.jpg",
    publishDate: "12 Januari 2025",
    readTime: "10 menit",
    author: "Tim Nugi Home Knifecraft"
  },
  {
    id: 3,
    title: "Review: Pisau Chef Damascus Steel Premium",
    content: `
      <p>Setelah menggunakan pisau chef Damascus steel premium selama 6 bulan, kami dapat memberikan review mendalam tentang performa dan karakteristik pisau ini.</p>
      
      <h2>Desain dan Estetika</h2>
      <p>Pola Damascus yang unik pada bilah tidak hanya memberikan keindahan visual, tetapi juga menunjukkan kualitas konstruksi berlapis yang meningkatkan kekuatan pisau.</p>
      
      <h2>Performa Pemotongan</h2>
      <p>Ketajaman pisau ini luar biasa. Dari memotong sayuran hingga memfilet ikan, pisau ini memberikan kontrol dan presisi yang sangat baik. Bilah yang tipis dan tajam memungkinkan potongan yang bersih tanpa merusak tekstur bahan makanan.</p>
      
      <h2>Ketahanan Ketajaman</h2>
      <p>Setelah penggunaan intensif selama 6 bulan, pisau masih mempertahankan ketajaman yang mengesankan. Hanya memerlukan pengasahan ringan setiap 2-3 bulan untuk hasil optimal.</p>
      
      <h2>Perawatan</h2>
      <p>Perawatan pisau Damascus relatif mudah. Cukup cuci dengan tangan menggunakan sabun lembut, keringkan segera, dan simpan di tempat kering. Hindari mesin pencuci piring untuk menjaga kualitas bilah.</p>
      
      <p>Secara keseluruhan, ini adalah investasi yang sangat baik untuk kitchen profesional atau pecinta kuliner serius.</p>
    `,
    thumbnail: "/pisau-damascus-koleksi.jpg",
    publishDate: "10 Januari 2025",
    readTime: "6 menit",
    author: "Tim Nugi Home Knifecraft"
  },
  {
    id: 4,
    title: "Tutorial Lengkap Perawatan Pisau Carbon Steel",
    content: `
      <p>Pisau carbon steel dikenal dengan ketajaman superior, namun memerlukan perawatan khusus untuk menjaga kualitasnya. Berikut panduan lengkap perawatan pisau carbon steel.</p>
      
      <h2>Pembersihan Setelah Penggunaan</h2>
      <p>Segera cuci pisau setelah digunakan dengan air hangat dan sabun lembut. Keringkan segera dengan kain bersih untuk mencegah karat. Jangan biarkan pisau dalam kondisi basah atau kotor.</p>
      
      <h2>Pencegahan Karat</h2>
      <p>Carbon steel rentan terhadap karat. Aplikasikan lapisan tipis minyak mineral atau camellia oil pada bilah setelah dibersihkan, terutama jika tidak akan digunakan dalam waktu lama.</p>
      
      <h2>Penyimpanan yang Tepat</h2>
      <p>Simpan pisau di tempat kering dengan ventilasi baik. Gunakan sarung pisau atau magnetic knife strip. Hindari menyimpan dalam laci bersama peralatan lain yang dapat merusak bilah.</p>
      
      <h2>Pengasahan Berkala</h2>
      <p>Asah pisau secara berkala menggunakan whetstone dengan grit yang sesuai. Mulai dengan grit 1000 untuk pengasahan rutin, dan gunakan grit lebih tinggi (3000-8000) untuk finishing.</p>
      
      <h2>Patina: Lapisan Pelindung Alami</h2>
      <p>Seiring penggunaan, pisau carbon steel akan mengembangkan patina - lapisan oksidasi yang berfungsi sebagai pelindung alami terhadap karat. Jangan khawatir dengan perubahan warna ini, justru ini menunjukkan pisau yang well-seasoned.</p>
      
      <p>Dengan perawatan yang tepat, pisau carbon steel Anda akan memberikan performa optimal selama bertahun-tahun.</p>
    `,
    thumbnail: "/pisau-premium-di-atas-meja-kayu.jpg",
    publishDate: "8 Januari 2025",
    readTime: "12 menit",
    author: "Tim Nugi Home Knifecraft"
  },
  {
    id: 5,
    title: "Sejarah dan Evolusi Pisau Jepang",
    content: `
      <p>Pisau Jepang memiliki sejarah panjang yang dimulai dari tradisi pembuatan katana samurai. Mari kita telusuri evolusi pisau Jepang dari masa ke masa.</p>
      
      <h2>Era Samurai</h2>
      <p>Teknik pembuatan pisau Jepang berakar dari tradisi pembuatan katana yang telah ada sejak abad ke-8. Para pandai besi samurai mengembangkan metode pelipatan baja yang menghasilkan bilah dengan kekuatan dan ketajaman luar biasa.</p>
      
      <h2>Transisi ke Pisau Dapur</h2>
      <p>Setelah era Meiji, banyak pandai besi samurai beralih profesi membuat pisau dapur. Mereka menerapkan teknik pembuatan katana pada pisau dapur, menghasilkan peralatan masak dengan kualitas exceptional.</p>
      
      <h2>Jenis-Jenis Pisau Jepang Modern</h2>
      <p>Saat ini, ada berbagai jenis pisau Jepang yang dirancang untuk fungsi spesifik:</p>
      <ul>
        <li><strong>Gyuto:</strong> Pisau chef serbaguna untuk berbagai tugas pemotongan</li>
        <li><strong>Santoku:</strong> Pisau tiga fungsi untuk daging, ikan, dan sayuran</li>
        <li><strong>Nakiri:</strong> Pisau khusus untuk memotong sayuran</li>
        <li><strong>Yanagiba:</strong> Pisau panjang untuk memotong sashimi</li>
        <li><strong>Deba:</strong> Pisau tebal untuk memotong tulang ikan</li>
      </ul>
      
      <h2>Teknik Pembuatan Tradisional</h2>
      <p>Pisau Jepang tradisional dibuat menggunakan teknik single-bevel atau double-bevel. Single-bevel memberikan ketajaman ekstrim untuk pemotongan presisi, sementara double-bevel lebih versatile untuk penggunaan umum.</p>
      
      <h2>Pengaruh Global</h2>
      <p>Kini, pisau Jepang telah diakui di seluruh dunia sebagai standar kualitas tinggi. Banyak chef profesional memilih pisau Jepang karena ketajaman, keseimbangan, dan daya tahannya.</p>
      
      <p>Tradisi pembuatan pisau Jepang terus berkembang, menggabungkan teknik tradisional dengan inovasi modern untuk menciptakan pisau berkualitas world-class.</p>
    `,
    thumbnail: "/pisau-handmade-premium-close-up-product-photo-on-d.jpg",
    publishDate: "5 Januari 2025",
    readTime: "15 menit",
    author: "Tim Nugi Home Knifecraft"
  },
  {
    id: 6,
    title: "Tips Memilih Pisau Pertama untuk Pemula",
    content: `
      <p>Memulai koleksi pisau bisa membingungkan dengan banyaknya pilihan yang tersedia. Berikut panduan untuk memilih pisau pertama yang tepat.</p>
      
      <h2>Tentukan Kebutuhan Anda</h2>
      <p>Pertimbangkan apa yang akan Anda lakukan dengan pisau tersebut. Untuk penggunaan umum di dapur, pisau chef atau santoku adalah pilihan terbaik. Untuk outdoor, pertimbangkan pisau bushcraft atau survival.</p>
      
      <h2>Jenis Baja</h2>
      <p>Ada dua kategori utama:</p>
      <ul>
        <li><strong>Stainless Steel:</strong> Tahan karat, mudah perawatan, cocok untuk pemula</li>
        <li><strong>Carbon Steel:</strong> Lebih tajam, memerlukan perawatan lebih, untuk pengguna berpengalaman</li>
      </ul>
      
      <h2>Bahan Handle</h2>
      <p>Handle yang nyaman sangat penting untuk penggunaan jangka panjang:</p>
      <ul>
        <li><strong>Kayu:</strong> Klasik, nyaman, natural grip</li>
        <li><strong>Plastik/Polimer:</strong> Durable, mudah dibersihkan, ekonomis</li>
        <li><strong>G10/Micarta:</strong> Sangat durable, tahan air, premium feel</li>
      </ul>
      
      <h2>Ukuran yang Tepat</h2>
      <p>Untuk pisau chef, ukuran 8 inci (20cm) adalah standar yang versatile. Terlalu besar atau kecil bisa mengurangi efisiensi. Coba pegang pisau sebelum membeli untuk merasakan keseimbangannya.</p>
      
      <h2>Budget yang Realistis</h2>
      <p>Untuk pemula, pisau dengan range harga Rp 500.000 - Rp 1.500.000 sudah memberikan kualitas yang sangat baik. Hindari pisau terlalu murah yang cepat tumpul atau terlalu mahal yang belum Anda butuhkan.</p>
      
      <h2>Merek yang Direkomendasikan untuk Pemula</h2>
      <p>Beberapa merek yang menawarkan kualitas baik dengan harga terjangkau: Victorinox, Tojiro, Mercer, dan tentu saja koleksi kami di Nugi Home Knifecraft.</p>
      
      <h2>Perawatan Dasar</h2>
      <p>Apapun pisau yang Anda pilih, pastikan Anda siap untuk merawatnya:</p>
      <ul>
        <li>Cuci dengan tangan, jangan mesin pencuci piring</li>
        <li>Keringkan segera setelah dicuci</li>
        <li>Gunakan cutting board kayu atau plastik</li>
        <li>Asah berkala untuk menjaga ketajaman</li>
      </ul>
      
      <p>Dengan pemilihan yang tepat dan perawatan yang baik, pisau pertama Anda akan menjadi companion setia di dapur atau outdoor adventure Anda.</p>
    `,
    thumbnail: "/pisau-chef-8-inci.jpg",
    publishDate: "3 Januari 2025",
    readTime: "9 menit",
    author: "Tim Nugi Home Knifecraft"
  }
]

export default function BlogArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetcher(`/api/articles/${params.id}`)
        if (response.article) {
          setArticle(response.article)
        } else {
          // Fallback to hardcoded articles if API fails
          const articleId = parseInt(params.id)
          const fallbackArticle = fallbackArticles.find((a) => a.id === articleId)
          if (fallbackArticle) {
            setArticle({
              id: fallbackArticle.id.toString(),
              type: "blog",
              title: fallbackArticle.title,
              excerpt: "",
              content: fallbackArticle.content,
              image: fallbackArticle.thumbnail,
              publishDate: fallbackArticle.publishDate,
              readTime: fallbackArticle.readTime,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        // Fallback to hardcoded articles
        const articleId = parseInt(params.id)
        const fallbackArticle = fallbackArticles.find((a) => a.id === articleId)
        if (fallbackArticle) {
          setArticle({
            id: fallbackArticle.id.toString(),
            type: "blog",
            title: fallbackArticle.title,
            excerpt: "",
            content: fallbackArticle.content,
            image: fallbackArticle.thumbnail,
            publishDate: fallbackArticle.publishDate,
            readTime: fallbackArticle.readTime,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-zinc-300">Memuat artikel...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 text-zinc-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Blog
          </Button>
        </Link>

        {/* Article header */}
        <article className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              {article.publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishDate}</span>
                </div>
              )}
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
              )}
              {article.publishDate && article.readTime && <span>•</span>}
              <span>Oleh Tim Nugi Home Knifecraft</span>
            </div>
          </div>

          {/* Featured image */}
          {/* Featured image */}
          {article.image && (
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-p:mb-4">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div>
                <p>{article.excerpt}</p>
                <p className="text-zinc-400 italic mt-4">Konten lengkap artikel akan segera tersedia.</p>
              </div>
            )}
          </div>

          {/* Share section */}
          <div className="border-t border-zinc-800 pt-8 mt-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Bagikan artikel ini</h3>
                <p className="text-sm text-zinc-400">Berbagi pengetahuan dengan komunitas</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white">
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white">
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Back to blog link */}
          <div className="text-center pt-8">
            <Link href="/blog">
              <Button variant="outline" className="border-amber-600/30 text-amber-400 hover:bg-amber-600/10">
                Lihat Artikel Lainnya
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}