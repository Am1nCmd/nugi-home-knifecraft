"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  productTitle: string
  productPrice: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WhatsAppButton({
  productTitle,
  productPrice,
  className = "",
  variant = "default",
  size = "default"
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const message = `Halo, saya tertarik dengan ${productTitle} seharga ${productPrice}. Bisa minta info lebih lanjut?`
    const whatsappUrl = `https://wa.me/6281199214?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Always use green styling regardless of variant
  const isOutline = variant === "outline"
  const buttonClasses = isOutline
    ? `border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent font-medium transition-all duration-200 ${className}`
    : `bg-green-600 hover:bg-green-700 text-white font-medium border border-green-600 hover:border-green-700 ${className}`

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={buttonClasses}
      variant={isOutline ? "outline" : "default"}
      size={size}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Beli via WhatsApp
    </Button>
  )
}