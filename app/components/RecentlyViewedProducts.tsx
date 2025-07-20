"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, X, ShoppingCart, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRecentlyViewed } from "../hooks/useRecentlyViewed"
import { useCart } from "../hooks/useCart"
import { useToastContext } from "./ToastProvider"
import Image from "next/image"
import Link from "next/link"

export default function RecentlyViewedProducts() {
  const { recentlyViewed, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed()
  const { addToCart } = useCart()
  const { showToast } = useToastContext()

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    showToast(`${product.name} added to cart!`, "success")
  }

  const handleRemoveItem = (productId: string, productName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromRecentlyViewed(productId)
    showToast(`${productName} removed from recently viewed`, "info")
  }

  const handleClearAll = () => {
    clearRecentlyViewed()
    showToast("Recently viewed history cleared", "info")
  }

  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Recently Viewed</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Eye className="h-4 w-4 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Products you've recently looked at</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear your recently viewed history</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {recentlyViewed.slice(0, 8).map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-48 group">
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleRemoveItem(product.id, product.name, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove from recently viewed</p>
                    </TooltipContent>
                  </Tooltip>

                  <Link href={`/product/${product.id}`}>
                    <div className="cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-2 bg-white shadow-sm">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white px-2 py-1 rounded text-xs font-medium">Out of Stock</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          #{index + 1}
                        </div>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-purple-700 transition-colors">
                            {product.name}
                          </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-48">{product.name}</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-xs">₹{product.originalPrice}</span>
                        )}
                      </div>

                      <div className="text-xs text-gray-600 mb-2">{product.brand}</div>
                    </div>
                  </Link>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {product.inStock ? `Add ${product.name} to your cart` : "This item is currently out of stock"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          {recentlyViewed.length > 8 && (
            <div className="text-center mt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    View All {recentlyViewed.length} Items
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See your complete viewing history</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className="text-xs text-gray-600 mt-3 text-center bg-white/50 p-2 rounded">
            💡 <strong>Tip:</strong> Your recently viewed items are saved automatically and persist across sessions
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
