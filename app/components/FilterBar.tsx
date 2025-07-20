"use client"

import { useState } from "react"
import { ChevronDown, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FilterBarProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  sortBy: string
  onSortChange: (sort: string) => void
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterType: string, value: string) => void
}

const filterOptions = {
  Sort: [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Newest", value: "newest" },
    { label: "Best Rating", value: "rating" },
  ],
  Size: [
    { label: "XS", value: "xs" },
    { label: "S", value: "s" },
    { label: "M", value: "m" },
    { label: "L", value: "l" },
    { label: "XL", value: "xl" },
    { label: "XXL", value: "xxl" },
  ],
  Colour: [
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Blue", value: "blue" },
    { label: "Pink", value: "pink" },
    { label: "Green", value: "green" },
    { label: "Yellow", value: "yellow" },
  ],
  Season: [
    { label: "Spring", value: "spring" },
    { label: "Summer", value: "summer" },
    { label: "Autumn", value: "autumn" },
    { label: "Winter", value: "winter" },
  ],
  Purpose: [
    { label: "Casual", value: "casual" },
    { label: "Formal", value: "formal" },
    { label: "Sport", value: "sport" },
    { label: "Party", value: "party" },
  ],
  Style: [
    { label: "Minimalist", value: "minimalist" },
    { label: "Vintage", value: "vintage" },
    { label: "Modern", value: "modern" },
    { label: "Bohemian", value: "bohemian" },
  ],
  Material: [
    { label: "Cotton", value: "cotton" },
    { label: "Polyester", value: "polyester" },
    { label: "Wool", value: "wool" },
    { label: "Silk", value: "silk" },
    { label: "Denim", value: "denim" },
  ],
}

export default function FilterBar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  selectedFilters,
  onFilterChange,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const getFilterLabel = (filterType: string) => {
    const selected = selectedFilters[filterType.toLowerCase()]
    if (selected && selected.length > 0) {
      return `${filterType} (${selected.length})`
    }
    return filterType
  }

  const handleFilterSelect = (filterType: string, value: string) => {
    onFilterChange(filterType.toLowerCase(), value)
  }

  return (
    <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
      {Object.entries(filterOptions).map(([filterType, options]) => (
        <DropdownMenu
          key={filterType}
          open={openDropdown === filterType}
          onOpenChange={(open) => setOpenDropdown(open ? filterType : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`filter-chip whitespace-nowrap ${
                selectedFilters[filterType.toLowerCase()]?.length > 0
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : ""
              }`}
            >
              {getFilterLabel(filterType)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  if (filterType === "Sort") {
                    onSortChange(option.value)
                  } else {
                    handleFilterSelect(filterType, option.value)
                  }
                }}
                className={
                  filterType === "Sort" && sortBy === option.value
                    ? "bg-purple-50 text-purple-700"
                    : selectedFilters[filterType.toLowerCase()]?.includes(option.value)
                      ? "bg-purple-50 text-purple-700"
                      : ""
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {/* View Mode Toggle */}
      <div className="flex border rounded-full ml-auto bg-white/80">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="rounded-r-none bg-transparent hover:bg-gray-100"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          className="rounded-l-none bg-transparent hover:bg-gray-100"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
