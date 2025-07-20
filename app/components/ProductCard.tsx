"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, Scale, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "../hooks/useCart"
import { useWishlist } from "../hooks/useWishlist"
import { useToastContext } from "../components/ToastProvider"
import type { Product } from "../types"
import { useProductComparison } from "../hooks/useProductComparison"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showToast } = useToastContext()
  const { addToCompare, isInCompareList, maxReached } = useProductComparison()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    showToast(`${product.name} added to cart!`, "success")
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      showToast(`${product.name} removed from wishlist`, "info")
    } else {
      addToWishlist(product)
      showToast(`${product.name} added to wishlist!`, "success")
    }
  }

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    const success = addToCompare(product)
    if (success) {
      showToast(`${product.name} added to comparison!`, "success")
    } else {
      showToast("Maximum 4 products can be compared at once", "warning")
    }
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <TooltipProvider>
      <div className="product-card group relative">
        <Link href={`/product/${product.id}`}>
          <div className="relative overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg?height=400&width=300&query=fashion clothing model"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{discountPercentage}%</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save ₹{(product.originalPrice! - product.price).toFixed(2)}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white text-black">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`bg-white/90 hover:bg-white rounded-full transition-all duration-200 ${
                      isInWishlist(product.id) ? "text-red-500" : "text-gray-600"
                    }`}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`bg-white/90 hover:bg-white rounded-full transition-all duration-200 ${
                      isInCompareList(product.id) ? "text-blue-500" : "text-gray-600"
                    }`}
                    onClick={handleAddToCompare}
                    disabled={maxReached && !isInCompareList(product.id)}
                  >
                    <Scale className={`h-4 w-4 ${isInCompareList(product.id) ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isInCompareList(product.id)
                      ? "In comparison list"
                      : maxReached
                        ? "Maximum 4 products can be compared"
                        : "Add to comparison"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 hover:bg-white rounded-full transition-all duration-200 text-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick view product details</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating}</span>
            </div>
          </div>

          <div className="p-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-64">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-black">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center justify-between mb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-gray-600 cursor-help">{product.brand}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Brand: {product.brand}</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-gray-500 cursor-help">({product.reviews})</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{product.reviews} customer reviews</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </Link>

        {/* Add to Cart Button */}
        <div className="px-4 pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {product.inStock ? `Add ${product.name} to your shopping cart` : "This item is currently unavailable"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
