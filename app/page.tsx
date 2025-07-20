"use client"

import { useState, useEffect, useMemo } from "react"
import Navigation from "./components/Navigation"
import HeroBanner from "./components/HeroBanner"
import ProductSidebar from "./components/ProductSidebar"
import FilterBar from "./components/FilterBar"
import ProductCard from "./components/ProductCard"
import ProductListItem from "./components/ProductListItem"
import ProductSkeleton from "./components/ProductSkeleton"
import BackToTop from "./components/BackToTop"
import { useCart } from "./hooks/useCart"
import { useToastContext } from "./components/ToastProvider"
import type { Product } from "./types"
import PromotionalBanners from "./components/PromotionalBanners"
import RecentlyViewedProducts from "./components/RecentlyViewedProducts"

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist White Cotton Tee",
    description: "Essential white cotton t-shirt with relaxed fit",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    tags: ["cotton", "basic", "white", "casual", "minimalist"],
  },
  {
    id: "2",
    name: "Oversized Cream Sweater",
    description: "Cozy oversized sweater in cream color",
    price: 599.99,
    originalPrice: 799.99,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    tags: ["sweater", "oversized", "cream", "casual", "wool"],
  },
  {
    id: "3",
    name: "Light Blue Denim Shirt",
    description: "Classic light blue denim shirt with modern cut",
    price: 499.99,
    originalPrice: 699.99,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.3,
    reviews: 203,
    inStock: true,
    tags: ["denim", "shirt", "blue", "casual", "modern"],
  },
  {
    id: "4",
    name: "Soft Yellow Knit Top",
    description: "Comfortable yellow knit top with subtle texture",
    price: 399.99,
    originalPrice: 549.99,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.6,
    reviews: 67,
    inStock: true,
    tags: ["knit", "yellow", "comfortable", "casual", "cotton"],
  },
  {
    id: "5",
    name: "Classic White Button Shirt",
    description: "Timeless white button-up shirt for any occasion",
    price: 449.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    tags: ["shirt", "white", "classic", "formal", "cotton"],
  },
  {
    id: "6",
    name: "Pastel Pink Blouse",
    description: "Elegant pastel pink blouse with flowing silhouette",
    price: 529.99,
    originalPrice: 699.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.4,
    reviews: 312,
    inStock: false,
    tags: ["blouse", "pink", "elegant", "formal", "silk"],
  },
  {
    id: "7",
    name: "Striped Long Sleeve Tee",
    description: "Casual striped long sleeve t-shirt in navy and white",
    price: 349.99,
    originalPrice: 449.99,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.2,
    reviews: 94,
    inStock: true,
    tags: ["striped", "long sleeve", "casual", "cotton", "modern"],
  },
  {
    id: "8",
    name: "Beige Cropped Cardigan",
    description: "Stylish beige cropped cardigan perfect for layering",
    price: 649.99,
    originalPrice: 849.99,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    category: "Tops",
    brand: "SnugBuy",
    rating: 4.5,
    reviews: 178,
    inStock: true,
    tags: ["cardigan", "beige", "cropped", "casual", "wool"],
  },
  // Add more products for better filtering demonstration
  {
    id: "9",
    name: "Black Leather Pants",
    description: "Edgy black leather pants with slim fit",
    price: 129.99,
    originalPrice: 159.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "Pants",
    brand: "SnugBuy",
    rating: 4.3,
    reviews: 89,
    inStock: true,
    tags: ["pants", "leather", "black", "party", "modern"],
  },
  {
    id: "10",
    name: "High-Waisted Jeans",
    description: "Classic high-waisted blue jeans with vintage wash",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "Pants",
    brand: "SnugBuy",
    rating: 4.6,
    reviews: 234,
    inStock: true,
    tags: ["jeans", "blue", "vintage", "casual", "denim"],
  },
]

const ITEMS_PER_PAGE = 8

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("new")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const { cartItems } = useCart()
  const { showToast } = useToastContext()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory =
        selectedCategory === "new" ||
        selectedCategory === "bestsellers" ||
        (selectedCategory === "tops" && product.category === "Tops") ||
        (selectedCategory === "pants" && product.category === "Pants")

      // Additional filters
      const matchesFilters = Object.entries(selectedFilters).every(([filterType, values]) => {
        if (values.length === 0) return true

        switch (filterType) {
          case "colour":
            return values.some((color) => product.tags.some((tag) => tag.toLowerCase().includes(color.toLowerCase())))
          case "material":
            return values.some((material) =>
              product.tags.some((tag) => tag.toLowerCase().includes(material.toLowerCase())),
            )
          case "style":
            return values.some((style) => product.tags.some((tag) => tag.toLowerCase().includes(style.toLowerCase())))
          case "purpose":
            return values.some((purpose) =>
              product.tags.some((tag) => tag.toLowerCase().includes(purpose.toLowerCase())),
            )
          default:
            return true
        }
      })

      return matchesSearch && matchesCategory && matchesFilters
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return Number.parseInt(b.id) - Number.parseInt(a.id)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedFilters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return { ...prev, [filterType]: newValues }
    })
    setCurrentPage(1)
  }

  const handleShopNow = () => {
    setSelectedCategory("new")
    showToast("Showing new arrivals with 50% discount!", "success")
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    setSearchQuery("")
    setSortBy("featured")
    setCurrentPage(1)
    showToast("All filters cleared", "info")
  }

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation cartItemCount={totalCartItems} />
        <HeroBanner />
        <main className="container mx-auto px-6">
          <div className="flex gap-8">
            <ProductSidebar />
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">New arrivals</h2>
                <p className="text-gray-600">View more</p>
              </div>
              <FilterBar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation cartItemCount={totalCartItems} onSearch={setSearchQuery} searchQuery={searchQuery} />
      <HeroBanner onShopNow={handleShopNow} />
      <PromotionalBanners />

      <main className="container mx-auto px-6 pb-12">
        <div className="flex gap-8">
          <ProductSidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">
                  {selectedCategory === "new" && "New arrivals"}
                  {selectedCategory === "bestsellers" && "Bestsellers"}
                  {selectedCategory === "tops" && "Tops"}
                  {selectedCategory === "pants" && "Pants & Tights"}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} items found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
                <button onClick={clearAllFilters} className="text-sm text-purple-600 hover:text-purple-800 underline">
                  Clear all filters
                </button>
              )}
            </div>

            <RecentlyViewedProducts />

            <FilterBar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />

            {/* Active Filters Display */}
            {Object.entries(selectedFilters).some(([_, values]) => values.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(([filterType, values]) =>
                  values.map((value) => (
                    <span
                      key={`${filterType}-${value}`}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {value}
                      <button
                        onClick={() => handleFilterChange(filterType, value)}
                        className="ml-1 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  )),
                )}
              </div>
            )}

            {/* Products Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button onClick={clearAllFilters} className="hm-button">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === page ? "bg-black text-white" : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <BackToTop />
    </div>
  )
}
