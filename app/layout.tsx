import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Montserrat, Raleway, Playfair_Display } from "next/font/google"
import { Suspense } from "react"
import AuthProvider from "@/components/session-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nugi Home Knifecraft - Premium Handcrafted Knives",
  description: "Discover premium handcrafted knives and tools. Traditional techniques meet modern innovation in every blade we create.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${raleway.variable} ${playfairDisplay.variable} antialiased`}>
      <body className="font-sans bg-zinc-900 text-zinc-100">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
