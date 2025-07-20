"use client"

import { Star, TrendingUp, Shirt, Package } from "lucide-react"

interface SidebarItem {
  name: string
  icon: any
  color: string
  count: number
  category: string
  active?: boolean
}

const sidebarItems: SidebarItem[] = [
  { name: "Bestsellers", icon: Star, color: "text-yellow-500", count: 245, category: "bestsellers" },
  { name: "New arrivals", icon: TrendingUp, color: "text-green-500", count: 89, category: "new", active: true },
  { name: "Tops", icon: Shirt, color: "text-blue-500", count: 156, category: "tops" },
  { name: "Pants & Tights", icon: Package, color: "text-purple-500", count: 78, category: "pants" },
]

interface ProductSidebarProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function ProductSidebar({ selectedCategory, onCategoryChange }: ProductSidebarProps) {
  const handleCategoryClick = (category: string) => {
    onCategoryChange?.(category)
  }

  return (
    <div className="w-64 bg-white/40 backdrop-blur-sm rounded-2xl p-6 h-fit">
      <div className="space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleCategoryClick(item.category)}
            className={`sidebar-item w-full ${
              selectedCategory === item.category || item.active
                ? "bg-purple-100 text-purple-800"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <span className="font-medium">{item.name}</span>
            </div>
            <span className="text-sm text-gray-500">{item.count}</span>
          </button>
        ))}
      </div>

      {/* Additional filters */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Quick Filters</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">On Sale</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Free Shipping</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">In Stock</span>
          </label>
        </div>
      </div>
    </div>
  )
}
