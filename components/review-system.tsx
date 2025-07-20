"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageSquare, TrendingUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "../hooks/use-language"
import { menuItems } from "../data/menu-data"
import type { Review } from "../types"

const mockReviews: Review[] = [
  {
    id: "rev-1",
    customerName: "Alice Johnson",
    rating: 5,
    comment:
      "Amazing Pad Thai! The flavors were perfectly balanced and the portion was generous. Will definitely order again!",
    date: "2024-01-18",
    verified: true,
  },
  {
    id: "rev-2",
    customerName: "Bob Smith",
    rating: 4,
    comment:
      "Good food overall. The Tom Yum soup was a bit too spicy for my taste, but the spring rolls were excellent.",
    date: "2024-01-17",
    verified: true,
  },
  {
    id: "rev-3",
    customerName: "Carol Lee",
    rating: 5,
    comment: "Best Thai restaurant in town! The Green Curry is absolutely delicious and authentic.",
    date: "2024-01-16",
    verified: false,
  },
  {
    id: "rev-4",
    customerName: "David Chen",
    rating: 3,
    comment: "Food was okay, but service was a bit slow. The mango sticky rice was great though!",
    date: "2024-01-15",
    verified: true,
  },
]

export function ReviewSystem() {
  const { t } = useLanguage()
  const [reviews] = useState<Review[]>(mockReviews)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const filteredReviews = selectedRating ? reviews.filter((review) => review.rating === selectedRating) : reviews

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  const topRatedItems = menuItems
    .filter((item) => item.totalReviews > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5)

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⭐ {t("reviews")}</h1>
        <p className="text-gray-600">Customer reviews and feedback management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="items">Item Ratings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Positive Reviews</p>
                    <p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.rating >= 4).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold">+{Math.floor(reviews.length * 0.3)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Breakdown of customer ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{review.customerName}</span>
                        {review.verified && <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by rating:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRating === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRating(null)}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={selectedRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRating(rating)}
                  className="flex items-center gap-1"
                >
                  {rating} <Star className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{review.customerName}</span>
                      {review.verified && <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark as Helpful
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Items</CardTitle>
              <CardDescription>Menu items with highest customer ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRatedItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.totalReviews} reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(item.averageRating))}
                      <span className="font-medium">{item.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
