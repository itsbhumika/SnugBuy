"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToastContext } from "./ToastProvider"
import Image from "next/image"

interface HeroBannerProps {
  onShopNow?: () => void
}

export default function HeroBanner({ onShopNow }: HeroBannerProps) {
  const { showToast } = useToastContext()
  const [promoCode] = useState("HM50")

  const handleShopNow = () => {
    onShopNow?.()
    showToast("Welcome to SnugBuy! Enjoy 50% off with code HM50", "success")
  }

  const handlePromoCodeClick = () => {
    navigator.clipboard.writeText(promoCode)
    showToast("Promo code HM50 copied to clipboard!", "success")
  }

  return (
    <div className="hero-gradient relative overflow-hidden rounded-3xl mx-6 mt-6 mb-8">
      <div className="relative z-10 flex items-center justify-between p-12 min-h-[300px]">
        {/* Left decorative elements */}
        <div className="absolute left-8 top-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-80 animate-pulse"></div>
        </div>
        <div className="absolute left-12 bottom-12">
          <Image
            src="/placeholder.svg?height=120&width=80"
            alt="Decorative leaf"
            width={80}
            height={120}
            className="opacity-60"
          />
        </div>

        {/* Center content */}
        <div className="flex-1 text-center z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            DISCOUNTS UP TO 50% FROM
            <br />
            <span className="text-purple-800">SnugBuy FASHION COLLECTION</span>
          </h1>

          <div className="mb-6">
            <span className="text-lg font-medium text-gray-700">PROMOCODE: </span>
            <button
              onClick={handlePromoCodeClick}
              className="text-lg font-bold text-black hover:text-purple-700 transition-colors cursor-pointer underline decoration-dashed"
            >
              {promoCode}
            </button>
          </div>

          <Button onClick={handleShopNow} className="hm-button">
            SHOP NOW
          </Button>

          {/* Color indicators */}
          <div className="flex justify-center gap-3 mt-6">
            <div className="w-4 h-4 bg-teal-400 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div className="w-4 h-4 bg-cyan-400 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
          </div>
        </div>

        {/* Right decorative elements */}
        <div className="absolute right-8 top-8">
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Fashion model"
            width={100}
            height={100}
            className="rounded-full hover:scale-105 transition-transform cursor-pointer"
          />
        </div>
        <div className="absolute right-12 bottom-8">
          <Image
            src="/placeholder.svg?height=120&width=100"
            alt="Fashion model with hat"
            width={100}
            height={120}
            className="rounded-2xl hover:scale-105 transition-transform cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
