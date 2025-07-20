"use client"

import { useState, useMemo } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Badge } from "../ui/Badge"
import { MenuItemSkeleton } from "../ui/LoadingSkeleton"
import { useTranslation } from "../../hooks/useTranslation"
import type { MenuItem, Language, DietaryTag } from "../../types"

interface MenuPageProps {
  menuItems: MenuItem[]
  language: Language
  tableNumber?: string
  onAddToCart: (item: MenuItem) => void
  cartItemCount: number
  onOpenCart: () => void
  loading?: boolean
}

export function MenuPage({
  menuItems,
  language,
  tableNumber,
  onAddToCart,
  cartItemCount,
  onOpenCart,
  loading = false,
}: MenuPageProps) {
  const { t } = useTranslation(language)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<DietaryTag[]>([])

  const categories = useMemo(() => {
    const cats = ["all", ...new Set(menuItems.map((item) => item.category))]
    return cats
  }, [menuItems])

  const dietaryTags: DietaryTag[] = ["vegan", "vegetarian", "gluten_free", "dairy_free", "nut_free", "halal"]

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesDietary =
        selectedDietaryTags.length === 0 || selectedDietaryTags.every((tag) => item.dietaryTags.includes(tag))

      return matchesSearch && matchesCategory && matchesDietary
    })
  }, [menuItems, searchQuery, selectedCategory, selectedDietaryTags])

  const toggleDietaryTag = (tag: DietaryTag) => {
    setSelectedDietaryTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const getItemName = (item: MenuItem) => {
    return item.translations[language]?.name || item.name
  }

  const getItemDescription = (item: MenuItem) => {
    return item.translations[language]?.description || item.description
  }

  const getPromotionDiscount = (item: MenuItem) => {
    return item.promotions?.find((p) => p.category === item.category)?.discount || 0
  }

  const getDiscountedPrice = (item: MenuItem) => {
    const discount = getPromotionDiscount(item)
    return discount > 0 ? item.price * (1 - discount / 100) : item.price
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("menu")}</h1>
          {tableNumber && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("table")} {tableNumber}
            </p>
          )}
        </div>

        <Button onClick={onOpenCart} className="relative">
          {t("cart")}
          {cartItemCount > 0 && (
            <Badge
              variant="danger"
              className="absolute -top-2 -right-2 min-w-[1.5rem] h-6 flex items-center justify-center"
            >
              {cartItemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-2">
            {dietaryTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedDietaryTags.includes(tag) ? "primary" : "secondary"}
                size="sm"
                onClick={() => toggleDietaryTag(tag)}
              >
                {tag.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const discount = getPromotionDiscount(item)
          const discountedPrice = getDiscountedPrice(item)

          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={getItemName(item)}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getItemName(item)}</h3>
                  <div className="flex gap-1">
                    {item.popular && <Badge variant="warning">🔥 {t("popular")}</Badge>}
                    {!item.available && <Badge variant="danger">{t("outOfStock")}</Badge>}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{getItemDescription(item)}</p>

                {/* Dietary Tags */}
                {item.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.dietaryTags.map((tag) => (
                      <Badge key={tag} variant="info" className="text-xs">
                        {tag.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Promotion */}
                {discount > 0 && (
                  <div className="mb-3">
                    <Badge variant="success">
                      {discount}% OFF - {item.promotions?.[0]?.description}
                    </Badge>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">${item.price.toFixed(2)}</span>
                    )}
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </div>

                  <Button onClick={() => onAddToCart({ ...item, quantity: 1 })} disabled={!item.available} size="sm">
                    {item.available ? t("addToCart") : t("outOfStock")}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No items found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
