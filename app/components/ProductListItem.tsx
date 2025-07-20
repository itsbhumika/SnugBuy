"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../hooks/useCart"
import type { Product } from "../types"

interface ProductListItemProps {
  product: Product
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/product/${product.id}`} className="flex-shrink-0">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={150}
                height={150}
                className="w-32 h-32 object-cover rounded-lg"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Badge variant="secondary" className="text-xs">
                    Out of Stock
                  </Badge>
                </div>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-1 left-1 text-xs" variant="destructive">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={`/product/${product.id}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-2 pr-4">{product.name}</h3>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <Badge variant="outline">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">{product.brand}</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button onClick={handleAddToCart} disabled={!product.inStock} className="flex-shrink-0">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
