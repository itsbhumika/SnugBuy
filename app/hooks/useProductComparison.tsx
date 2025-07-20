"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "../types"

interface ProductComparisonContextType {
  compareList: Product[]
  addToCompare: (product: Product) => boolean
  removeFromCompare: (productId: string) => void
  clearCompareList: () => void
  isInCompareList: (productId: string) => boolean
  maxReached: boolean
}

const ProductComparisonContext = createContext<ProductComparisonContextType | undefined>(undefined)

export function ProductComparisonProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("product-comparison")
    if (saved) {
      try {
        setCompareList(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading comparison list:", error)
        localStorage.removeItem("product-comparison")
      }
    }
  }, [])

  useEffect(() => {
    if (compareList.length > 0) {
      localStorage.setItem("product-comparison", JSON.stringify(compareList))
    } else {
      localStorage.removeItem("product-comparison")
    }
  }, [compareList])

  const addToCompare = (product: Product): boolean => {
    if (compareList.length >= 4) {
      return false // Max 4 products for comparison
    }

    if (compareList.find((item) => item.id === product.id)) {
      return false // Already in list
    }

    setCompareList((prev) => [...prev, product])
    return true
  }

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCompareList = () => {
    setCompareList([])
    localStorage.removeItem("product-comparison")
  }

  const isInCompareList = (productId: string) => {
    return compareList.some((item) => item.id === productId)
  }

  const maxReached = compareList.length >= 4

  return (
    <ProductComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompareList,
        isInCompareList,
        maxReached,
      }}
    >
      {children}
    </ProductComparisonContext.Provider>
  )
}

export function useProductComparison() {
  const context = useContext(ProductComparisonContext)
  if (context === undefined) {
    throw new Error("useProductComparison must be used within a ProductComparisonProvider")
  }
  return context
}
