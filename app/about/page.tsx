"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Heart, Target, Users, Award, Hammer } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Passion & Craft",
    description: "Setiap pisau dibuat dengan cinta dan dedikasi tinggi, menghadirkan karya seni fungsional yang membanggakan."
  },
  {
    icon: Target,
    title: "Precision & Quality",
    description: "Ketelitian dalam setiap detail, dari pemilihan material hingga finishing akhir yang sempurna."
  },
  {
    icon: Users,
    title: "Community First",
    description: "Membangun komunitas pecinta pisau dan berbagi pengetahuan untuk kemajuan bersama."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Berkomitmen menghadirkan produk berkualitas premium yang melampaui ekspektasi pelanggan."
  }
]

const teamMembers = [
  {
    name: "Andi Setiawan",
    role: "Master Bladesmith",
    description: "20+ tahun pengalaman dalam seni pembuatan pisau tradisional dan modern."
  },
  {
    name: "Maya Kusuma",
    role: "Design Director",
    description: "Ahli dalam ergonomi dan estetika pisau, memadukan fungsi dengan keindahan."
  },
  {
    name: "Budi Hartono",
    role: "Quality Control",
    description: "Memastikan setiap pisau memenuhi standar kualitas tertinggi sebelum sampai ke tangan Anda."
  }
]

export default function AboutPage() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/6281199921", "_blank")
  }

  return (
    <main className="bg-gradient-to-b from-zinc-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/wood-texture.jpg')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Tentang Kami
            </h1>
            <p className="text-xl md:text-2xl text-zinc-200 leading-relaxed">
              Menempa tradisi dan inovasi dalam setiap bilah yang kami ciptakan
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                Passion Yang <span className="text-amber-700">Menempa</span> Karya
              </h2>
              <div className="space-y-4 text-zinc-700 leading-relaxed">
                <p>
                  Dimulai dari sebuah bengkel kecil di tahun 2010, Nugi Home Knifecraft lahir dari
                  passion mendalam terhadap seni pembuatan pisau. Kami percaya bahwa setiap pisau
                  bukan hanya alat, tetapi karya seni yang memiliki jiwa dan cerita.
                </p>
                <p>
                  Setiap hari, kami menggabungkan teknik tradisional yang telah diwariskan turun-temurun
                  dengan inovasi modern. Dari pemilihan baja berkualitas tinggi hingga proses tempering
                  yang presisi, setiap langkah dilakukan dengan penuh perhatian dan dedikasi.
                </p>
                <p>
                  Lebih dari sekadar membuat pisau, kami membangun warisan. Warisan keahlian,
                  kualitas, dan kepercayaan yang akan terus hidup di setiap dapur dan di tangan
                  setiap chef yang menggunakan karya kami.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-zinc-800 to-amber-900 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/about/craftsman-at-work.jpg"
                  alt="Craftsman at work"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
                <Hammer className="w-12 h-12 text-amber-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/metal-texture.jpg')] opacity-5 bg-cover"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Filosofi & <span className="text-amber-400">Nilai-Nilai</span> Kami
            </h2>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
              Prinsip-prinsip yang memandu setiap langkah perjalanan kami dalam menciptakan
              karya pisau berkualitas tinggi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
              Tim <span className="text-amber-700">Ahli</span> Kami
            </h2>
            <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
              Bertemu dengan para master craftsman yang berdedikasi menghadirkan
              karya pisau terbaik untuk Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-zinc-200">
                <div className="aspect-square bg-gradient-to-br from-zinc-100 to-amber-50">
                  <img
                    src={`/about/team-member-${index + 1}.jpg`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-zinc-900 mb-1">{member.name}</h3>
                  <p className="text-amber-700 font-medium mb-3">{member.role}</p>
                  <p className="text-zinc-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Group Team Photo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-[3/2] bg-gradient-to-br from-zinc-800 to-amber-900 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/about/team-photo.jpg"
                alt="Tim Nugi Home Knifecraft"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6">
              <p className="text-white text-lg font-medium">Tim Nugi Home Knifecraft</p>
              <p className="text-zinc-300 text-sm">United in craft, excellence in every blade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-zinc-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
              Hubungi <span className="text-amber-700">Kami</span>
            </h2>
            <p className="text-zinc-600 text-lg mb-8 leading-relaxed">
              Ada pertanyaan tentang produk kami atau ingin konsultasi pisau custom?
              Tim kami siap membantu Anda dengan senang hati.
            </p>

            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Chat WhatsApp: 0811-999-214
            </Button>

            <p className="text-zinc-500 text-sm mt-4">
              Respons cepat • Konsultasi gratis • Layanan profesional
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}