"use client"

import { useState, useEffect, useMemo } from "react"
import { ShoppingCart, ChevronDown, ChevronRight, Search, Filter, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MenuItem } from "./menu-item"
import { FilterPanel } from "./filter-panel"
import { menuItems, categoryPromotions } from "../data/menu-data"
import type { MenuItem as MenuItemType, CartItem, DietaryTag } from "../types"

interface MenuPageProps {
  cartItems: CartItem[]
  onAddToCart: (item: MenuItemType) => void
  onOpenCart: () => void
  totalItems: number
}

export function MenuPage({ cartItems, onAddToCart, onOpenCart, totalItems }: MenuPageProps) {
  const [tableNumber, setTableNumber] = useState<string>("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<Set<DietaryTag>>(new Set())
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "limited">("all")
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  useEffect(() => {
    // Get table number from URL query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const table = urlParams.get("table") || "1"
    setTableNumber(table)

    // Expand all categories by default
    const categories = [...new Set(menuItems.map((item) => item.category || "Other"))]
    setExpandedCategories(new Set(categories))
  }, [])

  // Filter menu items based on search and filters
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Availability filter
      if (availabilityFilter === "available" && item.availability !== "available") return false
      if (availabilityFilter === "limited" && item.availability === "out_of_stock") return false

      // Popular filter
      if (showPopularOnly && !item.isPopular) return false

      // Dietary tags filter
      if (selectedDietaryTags.size > 0) {
        const hasAllTags = Array.from(selectedDietaryTags).every((tag) => item.dietaryTags.includes(tag))
        if (!hasAllTags) return false
      }

      return true
    })
  }, [searchQuery, availabilityFilter, showPopularOnly, selectedDietaryTags])

  // Group filtered items by category
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, MenuItemType[]>,
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDietaryTags(new Set())
    setAvailabilityFilter("all")
    setShowPopularOnly(false)
  }

  const activeFiltersCount =
    selectedDietaryTags.size + (availabilityFilter !== "all" ? 1 : 0) + (showPopularOnly ? 1 : 0)

  const categoryIcons: Record<string, string> = {
    Appetizers: "🥗",
    Soups: "🍲",
    "Main Dishes": "🍛",
    Salads: "🥙",
    Desserts: "🍰",
    Other: "🍽️",
  }

  const getPromotionForCategory = (category: string) => {
    return categoryPromotions.find((promo) => promo.category === category)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
          {tableNumber && <p className="text-orange-600 font-medium">Table {tableNumber}</p>}
        </div>

        {/* Cart Button */}
        <Button onClick={onOpenCart} variant="outline" size="sm" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-600">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-600">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-orange-600">
              Clear all
            </Button>
          )}

          {/* Quick Filter Badges */}
          {showPopularOnly && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          {availabilityFilter !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {availabilityFilter === "available" ? "Available" : "Limited Stock"}
            </Badge>
          )}
          {Array.from(selectedDietaryTags).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700">
              {tag.replace("_", " ")}
            </Badge>
          ))}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            selectedDietaryTags={selectedDietaryTags}
            onDietaryTagsChange={setSelectedDietaryTags}
            availabilityFilter={availabilityFilter}
            onAvailabilityFilterChange={setAvailabilityFilter}
            showPopularOnly={showPopularOnly}
            onShowPopularOnlyChange={setShowPopularOnly}
          />
        )}
      </div>

      {/* Results Summary */}
      {(searchQuery || activeFiltersCount > 0) && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredItems.length} of {menuItems.length} items
        </div>
      )}

      {/* Menu Categories */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => {
          const promotion = getPromotionForCategory(category)

          return (
            <div key={category} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[category] || "🍽️"}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                      {promotion && <Badge className={`text-xs ${promotion.color} border`}>{promotion.badge}</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{items.length} items</p>
                    {promotion && <p className="text-xs text-gray-500 mt-1">{promotion.description}</p>}
                  </div>
                </div>
                {expandedCategories.has(category) ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Category Items */}
              {expandedCategories.has(category) && (
                <div className="border-t bg-gray-50/50">
                  <div className="p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <MenuItem
                          key={item.id}
                          item={item}
                          onAddToCart={onAddToCart}
                          isInCart={cartItems.some((cartItem) => cartItem.id === item.id)}
                          promotion={promotion}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {Object.keys(groupedItems).length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <Button onClick={clearFilters} variant="outline">
            Clear all filters
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      {Object.keys(groupedItems).length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedCategories(new Set(Object.keys(groupedItems)))}
            className="text-xs"
          >
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpandedCategories(new Set())} className="text-xs">
            Collapse All
          </Button>
        </div>
      )}
    </div>
  )
}
