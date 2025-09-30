"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sword, Menu, X, Settings } from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Knife Blog", href: "/blog" },
  { name: "About Us", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/20 bg-zinc-900/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Nugi Home Knifecraft">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-lg">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <span className="font-serif text-xl font-bold text-white">Nugi Home</span>
              <div className="text-amber-400 text-sm font-medium">Knifecraft</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`relative font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-amber-400"
                          : "text-zinc-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Admin Link */}
          <div className="hidden md:flex items-center">
            <Link
              href="/admin/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors duration-200"
              title="Admin Panel"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/20">
            <nav className="py-4" aria-label="Mobile navigation">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                          isActive
                            ? "text-amber-400 bg-amber-400/10"
                            : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
                <li className="border-t border-zinc-800/20 pt-2">
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
