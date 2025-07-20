"use client"

import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navigation from "../components/Navigation"
import Breadcrumbs from "../components/Breadcrumbs"
import { useWishlist } from "../hooks/useWishlist"
import { useCart } from "../hooks/useCart"
import { useToastContext } from "../components/ToastProvider"
import Image from "next/image"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart, cartItems } = useCart()
  const { showToast } = useToastContext()

  const handleAddToCart = (product: any) => {
    addToCart(product)
    showToast("Added to cart!", "success")
  }

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
    showToast("Removed from wishlist", "info")
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">Save items you love for later!</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Wishlist" }]} />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistItems.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Link href={`/product/${product.id}`}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveFromWishlist(product.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary">{product.name}</h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-lg">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">${product.originalPrice}</span>
                    )}
                  </div>

                  <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
