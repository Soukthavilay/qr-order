"use client"

import { Plus, Check, Star, Clock, AlertTriangle, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MenuItem as MenuItemType, CategoryPromotion } from "../types"

interface MenuItemProps {
  item: MenuItemType
  onAddToCart: (item: MenuItemType) => void
  isInCart: boolean
  promotion?: CategoryPromotion
}

export function MenuItem({ item, onAddToCart, isInCart, promotion }: MenuItemProps) {
  const formatPrice = (price: number) => `₭${price.toLocaleString()}`

  const getDiscountedPrice = (originalPrice: number) => {
    if (promotion?.discount) {
      return originalPrice * (1 - promotion.discount / 100)
    }
    return originalPrice
  }

  const finalPrice = getDiscountedPrice(item.price)
  const hasDiscount = promotion?.discount && finalPrice < item.price

  const availabilityConfig = {
    available: {
      color: "bg-green-100 text-green-700",
      icon: <Check className="h-3 w-3" />,
      text: "Available",
    },
    limited: {
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="h-3 w-3" />,
      text: "Limited",
    },
    out_of_stock: {
      color: "bg-red-100 text-red-700",
      icon: <AlertTriangle className="h-3 w-3" />,
      text: "Out of Stock",
    },
  }

  const dietaryIcons = {
    vegetarian: "🌱",
    vegan: "🌿",
    gluten_free: "🌾",
    dairy_free: "🥛",
    nut_free: "🥜",
    spicy: "🌶️",
  }

  const isAvailable = item.availability !== "out_of_stock"

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 ${isAvailable ? "hover:-translate-y-1" : "opacity-75"}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className={`w-full h-full object-cover ${!isAvailable ? "grayscale" : ""}`}
        />

        {/* Popular Badge */}
        {item.isPopular && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white border-0">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}

        {/* Availability Badge */}
        <Badge className={`absolute top-2 right-2 ${availabilityConfig[item.availability].color} border-0`}>
          {availabilityConfig[item.availability].icon}
          <span className="ml-1 text-xs">{availabilityConfig[item.availability].text}</span>
        </Badge>

        {/* Promotion Badge */}
        {promotion && (
          <Badge className={`absolute bottom-2 left-2 ${promotion.color} border text-xs`}>{promotion.badge}</Badge>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            {item.spiceLevel && (
              <div className="flex">
                {Array.from({ length: item.spiceLevel }, (_, i) => (
                  <Flame key={i} className="h-3 w-3 text-red-500" />
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>

        {/* Dietary Tags */}
        {item.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietaryTags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs" title={tag.replace("_", " ")}>
                {dietaryIcons[tag]}
              </span>
            ))}
            {item.dietaryTags.length > 3 && (
              <span className="text-xs text-gray-500">+{item.dietaryTags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount && <span className="text-sm text-gray-500 line-through">{formatPrice(item.price)}</span>}
            <span className={`text-lg font-bold ${hasDiscount ? "text-green-600" : "text-orange-600"}`}>
              {formatPrice(finalPrice)}
            </span>
          </div>

          <Button
            onClick={() => onAddToCart(item)}
            size="sm"
            disabled={!isAvailable}
            className={`transition-all ${
              isInCart ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"
            } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {!isAvailable ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-1" />
                Unavailable
              </>
            ) : isInCart ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
