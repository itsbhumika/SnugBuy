"use client"

import type React from "react"

import Link from "next/link"
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "../hooks/useAuth"
import { useWishlist } from "../hooks/useWishlist"
import NotificationCenter from "./NotificationCenter"
import ProductComparisonModal from "./ProductComparisonModal"
import { useRef, useState, useEffect } from "react"

interface NavigationProps {
  cartItemCount: number
  onSearch?: (query: string) => void
  searchQuery?: string
}

export default function Navigation({ cartItemCount, onSearch, searchQuery = "" }: NavigationProps) {
  const { user, logout } = useAuth()
  const { wishlistItems } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      console.log("Searching for:", searchQuery)
    }
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Hamburger */}
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="flex items-center">
                    <span className="hm-logo text-black">SnugBuy</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to SnugBuy homepage</p>
                </TooltipContent>
              </Tooltip>
              {/* Hamburger Menu */}
              <div className="relative" ref={menuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  id="category-menu-btn"
                  aria-label="Open category menu"
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((open) => !open)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg z-50" id="category-menu-dropdown">
                    <Link href="/?category=men" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Men</Link>
                    <Link href="/?category=women" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Women</Link>
                    <Link href="/?category=kids" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Kids</Link>
                    <Link href="/?category=accessories" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Accessories</Link>
                    <Link href="/?category=electronics" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Electronics</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-8 relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search for items, brands, inspiration..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 bg-gray-50 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search products, brands, or categories</p>
                </TooltipContent>
              </Tooltip>
            </form>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/wishlist">
                    <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full">
                      <Heart className="h-5 w-5" />
                      {wishlistItems.length > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-500"
                        >
                          {wishlistItems.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View wishlist ({wishlistItems.length} items)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full">
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-500"
                        >
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View shopping cart ({cartItemCount} items)</p>
                </TooltipContent>
              </Tooltip>

              <NotificationCenter />
              <ProductComparisonModal />

              {user ? (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {user.firstName?.[0]?.toUpperCase() || "U"}
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Account menu - {user.firstName} {user.lastName}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign in to your account</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm font-medium text-gray-600 cursor-help">UA</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Language: Ukrainian</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
