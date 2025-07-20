"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, Clock, Gift, Truck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToastContext } from "./ToastProvider"
import { useNotifications } from "../hooks/useNotifications"

const promotionalBanners = [
  {
    id: 1,
    title: "🎉 Flash Sale - 70% OFF",
    description: "Limited time offer on selected items",
    backgroundColor: "bg-gradient-to-r from-red-500 to-pink-500",
    textColor: "text-white",
    cta: "Shop Now",
    icon: Gift,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    category: "sale",
  },
  {
    id: 2,
    title: "🚚 Free Shipping Weekend",
    description: "Free shipping on all orders - no minimum",
    backgroundColor: "bg-gradient-to-r from-green-500 to-teal-500",
    textColor: "text-white",
    cta: "Start Shopping",
    icon: Truck,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: "shipping",
  },
  {
    id: 3,
    title: "✨ New Collection Launch",
    description: "Discover our latest spring collection",
    backgroundColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
    textColor: "text-white",
    cta: "Explore",
    icon: Star,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    category: "new",
  },
  {
    id: 4,
    title: "💎 VIP Member Exclusive",
    description: "Extra 20% off for VIP members",
    backgroundColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
    textColor: "text-white",
    cta: "Join VIP",
    icon: Star,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "vip",
  },
]

export default function PromotionalBanners() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [dismissedBanners, setDismissedBanners] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { showToast } = useToastContext()
  const { addNotification } = useNotifications()

  const activeBanners = promotionalBanners.filter((banner) => !dismissedBanners.includes(banner.id))

  // Load dismissed banners from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dismissed-banners")
    if (saved) {
      try {
        setDismissedBanners(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading dismissed banners:", error)
      }
    }
  }, [])

  // Save dismissed banners to localStorage
  useEffect(() => {
    if (dismissedBanners.length > 0) {
      localStorage.setItem("dismissed-banners", JSON.stringify(dismissedBanners))
    }
  }, [dismissedBanners])

  // Auto-rotate banners
  useEffect(() => {
    if (activeBanners.length === 0 || !isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [activeBanners.length, isAutoPlaying])

  // Update countdown timer
  useEffect(() => {
    if (activeBanners.length === 0) return

    const updateTimer = () => {
      const banner = activeBanners[currentBanner]
      const now = new Date().getTime()
      const expiry = banner.expiresAt.getTime()
      const difference = expiry - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`)
        }
      } else {
        setTimeLeft("Expired")
        // Auto-dismiss expired banners
        handleDismiss(banner.id, true)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [currentBanner, activeBanners])

  const handleDismiss = (bannerId: number, isExpired = false) => {
    setDismissedBanners((prev) => [...prev, bannerId])
    const banner = promotionalBanners.find((b) => b.id === bannerId)

    if (isExpired) {
      showToast("Promotion has expired", "info")
    } else {
      showToast(`${banner?.title} dismissed`, "info")
    }

    // Adjust current banner index if needed
    if (activeBanners.length > 1) {
      setCurrentBanner((prev) => (prev >= activeBanners.length - 1 ? 0 : prev))
    }
  }

  const handleCTAClick = () => {
    const banner = activeBanners[currentBanner]
    showToast(`${banner.cta} clicked! Redirecting...`, "success")

    // Add notification about the action
    addNotification({
      type: "info",
      title: `${banner.cta} Action`,
      message: `You clicked on "${banner.title}" promotion`,
      actionUrl: "/",
      actionText: "Continue Shopping",
    })

    // In a real app, this would navigate to the appropriate page
    console.log(`Navigating to ${banner.category} page`)
  }

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const goToBanner = (index: number) => {
    setCurrentBanner(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  if (activeBanners.length === 0) {
    return null
  }

  const banner = activeBanners[currentBanner]
  const IconComponent = banner.icon

  return (
    <TooltipProvider>
      <Card className="mx-6 mb-6 overflow-hidden shadow-lg">
        <div className={`${banner.backgroundColor} ${banner.textColor} relative`}>
          <div className="flex items-center justify-between p-6 min-h-[120px]">
            {/* Navigation Arrows */}
            {activeBanners.length > 1 && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevBanner}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous promotion</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextBanner}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next promotion</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            {/* Dismiss Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDismiss(banner.id)}
                  className="absolute right-2 top-2 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dismiss this promotion</p>
              </TooltipContent>
            </Tooltip>

            {/* Auto-play indicator */}
            {activeBanners.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-2 left-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isAutoPlaying ? "Auto-rotating banners" : "Auto-rotation paused"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Banner Content */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <IconComponent className="h-8 w-8" />
                <h2 className="text-2xl font-bold">{banner.title}</h2>
              </div>

              <p className="text-lg mb-4 opacity-90">{banner.description}</p>

              <div className="flex items-center justify-center gap-6 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCTAClick}
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {banner.cta}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to explore this promotion</p>
                  </TooltipContent>
                </Tooltip>

                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm opacity-90">Ends in:</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="font-mono text-lg font-bold bg-black/20 px-3 py-1 rounded cursor-help">
                        {timeLeft}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Promotion expires on {banner.expiresAt.toLocaleDateString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Indicators */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {activeBanners.map((_, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => goToBanner(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentBanner ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to promotion {index + 1}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Progress bar for current promotion */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <div
              className="h-full bg-white transition-all duration-1000 ease-linear"
              style={{
                width: isAutoPlaying ? "100%" : "0%",
                animation: isAutoPlaying ? "progress 5s linear infinite" : "none",
              }}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </Card>
    </TooltipProvider>
  )
}
