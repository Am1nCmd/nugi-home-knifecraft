"use client"

import Link from "next/link"
import { Sword, MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Knives", href: "/knives" },
    { name: "Tools", href: "/tools" },
    { name: "Knife Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
  ],
  categories: [
    { name: "Chef Knives", href: "/knives" },
    { name: "Hunting Knives", href: "/knives" },
    { name: "Utility Knives", href: "/knives" },
    { name: "Custom Knives", href: "/knives" },
  ],
  support: [
    { name: "Care Guide", href: "/blog" },
    { name: "Warranty", href: "/about" },
    { name: "Returns", href: "/about" },
    { name: "FAQ", href: "/about" },
  ],
}

const socialMedia = [
  {
    name: "WhatsApp",
    href: "https://wa.me/6281199921",
    icon: MessageCircle,
    color: "hover:text-green-400",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/nugihomeknifecraft",
    icon: Instagram,
    color: "hover:text-pink-400",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/nugihomeknifecraft",
    icon: Facebook,
    color: "hover:text-blue-400",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@nugihomeknifecraft",
    icon: Youtube,
    color: "hover:text-red-400",
  },
]

export function Footer() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/6281199921", "_blank")
  }

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-lg">
                <Sword className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-white">Nugi Home</div>
                <div className="text-amber-400 text-sm font-medium">Knifecraft</div>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed mb-6">
              Menghadirkan pisau berkualitas tinggi dengan sentuhan tradisional dan inovasi modern.
              Setiap bilah adalah karya seni fungsional yang dibuat dengan passion dan presisi.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Jl. Kerajinan No. 123, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+62 811-999-214</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>info@nugihome.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:col-span-3">
            {/* Main Navigation */}
            <div>
              <h3 className="font-semibold text-white mb-4">Navigation</h3>
              <ul className="space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              <ul className="space-y-3">
                {navigation.categories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Media */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-white mb-3">Stay Updated</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Dapatkan tips perawatan pisau dan info produk terbaru langsung ke WhatsApp Anda.
              </p>
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join WhatsApp
              </Button>
            </div>

            {/* Social Media */}
            <div className="lg:text-right">
              <h3 className="font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex justify-start lg:justify-end space-x-4">
                {socialMedia.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-10 h-10 bg-zinc-800 rounded-lg text-zinc-400 ${item.color} transition-colors duration-200`}
                      aria-label={item.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800 bg-zinc-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-4">
              <p>&copy; 2025 Nugi Home Knifecraft. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}