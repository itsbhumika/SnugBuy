import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./hooks/useCart"
import { AuthProvider } from "./hooks/useAuth"
import { WishlistProvider } from "./hooks/useWishlist"
import { RecentlyViewedProvider } from "./hooks/useRecentlyViewed"
import { ProductComparisonProvider } from "./hooks/useProductComparison"
import { NotificationsProvider } from "./hooks/useNotifications"
import { ToastProvider } from "./components/ToastProvider"
import { TooltipProvider } from "./hooks/useTooltip"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SnugBuy - Fashion and Quality at the Best Price",
  description:
    "Discover the latest fashion trends and shop quality clothing at SnugBuy. Find everything from basics to statement pieces for women, men, and kids.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <ProductComparisonProvider>
                    <TooltipProvider>
                      <ToastProvider>
                        {children}
                        <Toaster />
                      </ToastProvider>
                    </TooltipProvider>
                  </ProductComparisonProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
