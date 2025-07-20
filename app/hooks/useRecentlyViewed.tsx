"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "../types"

interface RecentlyViewedContextType {
  recentlyViewed: Product[]
  addToRecentlyViewed: (product: Product) => void
  clearRecentlyViewed: () => void
  removeFromRecentlyViewed: (productId: string) => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("recently-viewed")
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recently viewed:", error)
        localStorage.removeItem("recently-viewed")
      }
    }
  }, [])

  useEffect(() => {
    if (recentlyViewed.length > 0) {
      localStorage.setItem("recently-viewed", JSON.stringify(recentlyViewed))
    }
  }, [recentlyViewed])

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id)
      const updated = [product, ...filtered].slice(0, 10) // Keep only last 10 items
      return updated
    })
  }

  const removeFromRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((item) => item.id !== productId)
      if (updated.length === 0) {
        localStorage.removeItem("recently-viewed")
      }
      return updated
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem("recently-viewed")
  }

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        removeFromRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider")
  }
  return context
}
