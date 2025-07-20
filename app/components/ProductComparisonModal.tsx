"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, Scale, Star, ShoppingCart } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useProductComparison } from "../hooks/useProductComparison"
import { useCart } from "../hooks/useCart"
import { useToastContext } from "./ToastProvider"
import Image from "next/image"
import Link from "next/link"

export default function ProductComparisonModal() {
  const { compareList, removeFromCompare, clearCompareList } = useProductComparison()
  const { addToCart } = useCart()
  const { showToast } = useToastContext()

  const handleAddToCart = (product: any) => {
    addToCart(product)
    showToast(`${product.name} added to cart!`, "success")
  }

  const handleRemoveFromCompare = (productId: string, productName: string) => {
    removeFromCompare(productId)
    showToast(`${productName} removed from comparison`, "info")
  }

  const handleClearAll = () => {
    clearCompareList()
    showToast("Comparison list cleared", "info")
  }

  const calculateSavings = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled={compareList.length === 0}>
                <Scale className="h-4 w-4" />
                Compare ({compareList.length})
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {compareList.length === 0
                ? "No products to compare"
                : `Compare ${compareList.length} product${compareList.length > 1 ? "s" : ""}`}
            </p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Product Comparison ({compareList.length}/4)
              </DialogTitle>
              {compareList.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleClearAll}>
                      Clear All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove all products from comparison</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </DialogHeader>

          {compareList.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No products to compare</h3>
              <p className="text-gray-600 mb-4">
                Add products to comparison by clicking the scale icon on product cards
              </p>
              <Link href="/">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Images and Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {compareList.map((product) => {
                  const savings = calculateSavings(product.price, product.originalPrice)
                  return (
                    <div key={product.id} className="relative">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                            onClick={() => handleRemoveFromCompare(product.id, product.name)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove from comparison</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <Link href={`/product/${product.id}`}>
                          <div className="relative overflow-hidden rounded-lg mb-4 group">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={200}
                              height={200}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="secondary">Out of Stock</Badge>
                              </div>
                            )}
                            {savings > 0 && <Badge className="absolute top-2 left-2 bg-red-500">-{savings}%</Badge>}
                          </div>
                        </Link>

                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-purple-700 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mb-3">
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
                          <span className="text-xs text-gray-600">({product.reviews})</span>
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {product.inStock
                                ? `Add ${product.name} to your cart`
                                : "This item is currently out of stock"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32 font-semibold">Feature</TableHead>
                      {compareList.map((product) => (
                        <TableHead key={product.id} className="text-center min-w-48 font-semibold">
                          <div className="truncate" title={product.name}>
                            {product.name}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">Price</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-lg">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                            )}
                            {calculateSavings(product.price, product.originalPrice) > 0 && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                Save {calculateSavings(product.price, product.originalPrice)}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">Rating</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id} className="text-center">
                          <div className="flex items-center justify-center gap-1">
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
                            <span className="font-medium">{product.rating}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.reviews} review{product.reviews !== 1 ? "s" : ""}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">Brand</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id} className="text-center font-medium">
                          {product.brand}
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">Category</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id} className="text-center">
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">Availability</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id} className="text-center">
                          <Badge
                            variant={product.inStock ? "default" : "destructive"}
                            className={product.inStock ? "bg-green-500" : ""}
                          >
                            {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">Tags</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id} className="text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {product.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 3 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="text-xs cursor-help">
                                    +{product.tags.length - 3}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-48">
                                    <p className="font-medium mb-1">All tags:</p>
                                    <p className="text-sm">{product.tags.join(", ")}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                💡 <strong>Tip:</strong> Click on product names or images to view detailed product pages. You can
                compare up to 4 products at once.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
