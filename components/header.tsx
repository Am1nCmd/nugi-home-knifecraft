import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" aria-label="Beranda">
          <div className="h-8 w-8 rounded-md bg-primary" aria-hidden="true" />
          <span className="font-semibold tracking-tight">Katalog Pisau</span>
        </Link>

        <nav aria-label="Menu utama">
          <ul className="flex items-center gap-6 text-sm md:text-base">
            <li>
              <Link className="hover:text-primary transition-colors" href="#home">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" href="#katalog">
                Katalog
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" href="#tentang">
                Tentang
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" href="#kontak">
                Kontak
              </Link>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="/knives">
                Knives
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="/tools">
                Tools
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
