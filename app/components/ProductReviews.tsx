"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, Flag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../hooks/useAuth"
import { useToastContext } from "./ToastProvider"

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  date: Date
  verified: boolean
  helpful: number
  notHelpful: number
  size?: string
  fit?: "Small" | "True to size" | "Large"
  images?: string[]
}

interface ProductReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
}

const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Sarah M.",
    rating: 5,
    title: "Perfect fit and quality!",
    comment:
      "I absolutely love this piece! The fabric is soft and comfortable, and the fit is exactly what I expected. The color is vibrant and hasn't faded after multiple washes. Highly recommend!",
    date: new Date("2024-01-15"),
    verified: true,
    helpful: 12,
    notHelpful: 1,
    size: "M",
    fit: "True to size",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Mike R.",
    rating: 4,
    title: "Good quality, runs a bit small",
    comment:
      "The quality is great and the design is exactly as shown. However, it runs a bit smaller than expected. I'd recommend sizing up if you're between sizes.",
    date: new Date("2024-01-10"),
    verified: true,
    helpful: 8,
    notHelpful: 2,
    size: "L",
    fit: "Small",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Emma L.",
    rating: 5,
    title: "Exceeded expectations!",
    comment:
      "This exceeded my expectations in every way. The material feels premium, the stitching is perfect, and it looks even better in person than in the photos.",
    date: new Date("2024-01-08"),
    verified: true,
    helpful: 15,
    notHelpful: 0,
    size: "S",
    fit: "True to size",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Alex K.",
    rating: 3,
    title: "Decent but not amazing",
    comment: "It's okay for the price. The quality is decent but nothing special. The fit is as expected.",
    date: new Date("2024-01-05"),
    verified: false,
    helpful: 3,
    notHelpful: 5,
    size: "M",
    fit: "True to size",
  },
]

export default function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews)
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest")
  const [filterBy, setFilterBy] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all")

  const { user } = useAuth()
  const { showToast } = useToastContext()

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  const filteredAndSortedReviews = reviews
    .filter((review) => filterBy === "all" || review.rating === Number.parseInt(filterBy))
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.date.getTime() - a.date.getTime()
        case "oldest":
          return a.date.getTime() - b.date.getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  const handleSubmitReview = () => {
    if (!user) {
      showToast("Please log in to write a review", "error")
      return
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      showToast("Please fill in all fields", "error")
      return
    }

    // In a real app, this would submit to an API
    showToast("Review submitted successfully!", "success")
    setNewReview({ rating: 5, title: "", comment: "" })
    setShowReviewForm(false)
  }

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    showToast(helpful ? "Marked as helpful" : "Marked as not helpful", "info")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating}★</span>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>

        <Button onClick={() => setShowReviewForm(!showReviewForm)}>Write a Review</Button>
      </div>

      {/* Write Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button key={rating} onClick={() => setNewReview((prev) => ({ ...prev, rating }))} className="p-1">
                    <Star
                      className={`h-6 w-6 ${
                        rating <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Summarize your review"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Tell others about your experience with this product"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview}>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && <Badge variant="secondary">Verified Purchase</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-muted-foreground mb-4">{review.comment}</p>

              {(review.size || review.fit) && (
                <div className="flex gap-4 mb-4 text-sm">
                  {review.size && (
                    <span>
                      <strong>Size:</strong> {review.size}
                    </span>
                  )}
                  {review.fit && (
                    <span>
                      <strong>Fit:</strong> {review.fit}
                    </span>
                  )}
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id, true)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button
                    onClick={() => handleHelpful(review.id, false)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Not helpful ({review.notHelpful})
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
