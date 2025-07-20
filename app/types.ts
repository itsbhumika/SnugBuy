export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string // e.g., 'SnugBuy'
  rating: number
  reviews: number
  inStock: boolean
  tags: string[]
}

export interface CartItem extends Product {
  quantity: number
}
