"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useTranslation } from "../../hooks/useTranslation"
import type { Language, Order } from "../../types"

interface ReviewPageProps {
  order: Order | null
  language: Language
  onSubmitReview: (review: { orderId: string; customerName: string; rating: number; comment: string }) => void
}

export function ReviewPage({ order, language, onSubmitReview }: ReviewPageProps) {
  const { t } = useTranslation(language)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (order && rating > 0) {
      onSubmitReview({
        orderId: order.id,
        customerName,
        rating,
        comment,
      })
      setIsSubmitted(true)
      setRating(0)
      setComment("")
      setCustomerName("")
    }
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No completed order to review</h2>
          <p className="text-gray-600 dark:text-gray-400">Complete an order to leave a review!</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you for your review!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your feedback helps us improve our service.</p>
          <Button onClick={() => setIsSubmitted(false)}>Leave Another Review</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("reviews")}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order #{order.id.slice(-6)}</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("rating")}</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("comment")}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Tell us about your experience..."
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={rating === 0}>
            {t("submit")} Review
          </Button>
        </form>
      </div>
    </div>
  )
}
