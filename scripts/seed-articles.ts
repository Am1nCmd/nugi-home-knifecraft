import { addManyArticles } from "@/lib/articles"
import { Article } from "@/data/articles"

// Seed data from existing components
const seedArticles: Partial<Article>[] = [
  // News articles (from components/home/news.tsx)
  {
    type: "news",
    title: "Tren Desain Pisau 2025",
    excerpt: "Eksplorasi bentuk bilah modern, profil bevel, dan finishing yang menggabungkan performa serta estetika.",
    image: "/knife-design-trend-editorial.jpg",
  },
  {
    type: "news",
    title: "Event Komunitas Knife-Making",
    excerpt: "Bertemu para pembuat pisau lokal, berbagi teknik heat treatment, dan uji performa di lapangan.",
    image: "/knife-maker-community-event.jpg",
  },
  {
    type: "news",
    title: "Tips Perawatan & Asah",
    excerpt: "Panduan step-by-step untuk mempertahankan ketajaman dan mencegah karat pada pisau kesayangan Anda.",
    image: "/knife-maintenance-sharpening-guide.jpg",
  },

  // Knowledge articles (from components/home/knowledge.tsx)
  {
    type: "knowledge",
    title: "Baja",
    excerpt: "Pemilihan baja memengaruhi ketajaman, ketahanan aus, dan kemudahan asah. Variasi komposisi (karbon, kromium, vanadium) dan metode pembuatan (forged vs stock removal) akan menentukan karakter bilah.",
    icon: "square", // represents the square icon
  },
  {
    type: "knowledge",
    title: "Kayu",
    excerpt: "Gagang kayu pilihan seperti walnut atau oak menghadirkan kenyamanan genggaman dan aksen natural. Perlakuan finishing yang tepat menjaga estetika dan keawetannya.",
    icon: "circle", // represents the circle icon
  },
  {
    type: "knowledge",
    title: "Heat Treatment",
    excerpt: "Proses quench dan temper menentukan keseimbangan antara kekerasan dan ketangguhan. Prosedur yang akurat penting untuk performa optimal dan umur pakai yang panjang.",
    icon: "gradient", // represents the gradient icon
  },

  // Blog articles (from app/blog/page.tsx)
  {
    type: "blog",
    title: "Kisah Dibalik Pembuatan Pisau Dapur Tradisional",
    excerpt: "Menyelami proses pembuatan pisau dapur tradisional dari tangan ahli pandai besi yang telah mewarisi teknik turun temurun selama puluhan tahun. Setiap langkah memiliki makna dan presisi yang tinggi.",
    image: "/blog/traditional-knife-making.jpg",
    publishDate: "15 Januari 2025",
    readTime: "8 menit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    type: "blog",
    title: "Proses Heat Treatment: Rahasia Ketajaman Pisau",
    excerpt: "Memahami proses heat treatment yang menjadi kunci utama ketajaman dan ketahanan pisau. Dari proses quenching hingga tempering, setiap tahap menentukan kualitas akhir pisau.",
    image: "/blog/heat-treatment-process.jpg",
    publishDate: "12 Januari 2025",
    readTime: "10 menit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    type: "blog",
    title: "Review: Pisau Chef Damascus Steel Premium",
    excerpt: "Pengalaman menggunakan pisau chef Damascus steel premium selama 6 bulan. Mulai dari performa memotong, ketahanan ketajaman, hingga kemudahan perawatan sehari-hari.",
    image: "/blog/damascus-chef-knife-review.jpg",
    publishDate: "10 Januari 2025",
    readTime: "6 menit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    type: "blog",
    title: "Tutorial Lengkap Perawatan Pisau Carbon Steel",
    excerpt: "Panduan step-by-step merawat pisau carbon steel agar tetap tajam dan bebas karat. Termasuk tips pembersihan, penyimpanan, dan pengasahan yang tepat.",
    image: "/blog/carbon-steel-maintenance.jpg",
    publishDate: "8 Januari 2025",
    readTime: "12 menit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    type: "blog",
    title: "Sejarah dan Evolusi Pisau Jepang",
    excerpt: "Menelusuri sejarah panjang pisau Jepang dari era samurai hingga modern. Bagaimana tradisi katana berkembang menjadi pisau dapur yang diakui dunia.",
    image: "/blog/japanese-knife-history.jpg",
    publishDate: "5 Januari 2025",
    readTime: "15 menit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    type: "blog",
    title: "Tips Memilih Pisau Pertama untuk Pemula",
    excerpt: "Panduan lengkap bagi pemula dalam memilih pisau pertama. Mulai dari jenis blade, handle material, hingga budget yang sesuai untuk memulai koleksi pisau.",
    image: "/blog/beginner-knife-guide.jpg",
    publishDate: "3 Januari 2025",
    readTime: "9 menit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
]

async function runSeed() {
  try {
    console.log("Seeding articles...")
    await addManyArticles(seedArticles)
    console.log("✅ Successfully seeded", seedArticles.length, "articles")
  } catch (error) {
    console.error("❌ Error seeding articles:", error)
  }
}

// Run if called directly
if (require.main === module) {
  runSeed()
}

export { runSeed as seedArticles }