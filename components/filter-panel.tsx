"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, Leaf, Wheat, Milk, Nut, Flame } from "lucide-react"
import type { DietaryTag } from "../types"

interface FilterPanelProps {
  selectedDietaryTags: Set<DietaryTag>
  onDietaryTagsChange: (tags: Set<DietaryTag>) => void
  availabilityFilter: "all" | "available" | "limited"
  onAvailabilityFilterChange: (filter: "all" | "available" | "limited") => void
  showPopularOnly: boolean
  onShowPopularOnlyChange: (show: boolean) => void
}

export function FilterPanel({
  selectedDietaryTags,
  onDietaryTagsChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  showPopularOnly,
  onShowPopularOnlyChange,
}: FilterPanelProps) {
  const dietaryOptions: { tag: DietaryTag; label: string; icon: React.ReactNode; color: string }[] = [
    {
      tag: "vegetarian",
      label: "Vegetarian",
      icon: <Leaf className="h-4 w-4" />,
      color: "bg-green-100 text-green-700",
    },
    { tag: "vegan", label: "Vegan", icon: <Leaf className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
    {
      tag: "gluten_free",
      label: "Gluten Free",
      icon: <Wheat className="h-4 w-4" />,
      color: "bg-amber-100 text-amber-700",
    },
    { tag: "dairy_free", label: "Dairy Free", icon: <Milk className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
    { tag: "nut_free", label: "Nut Free", icon: <Nut className="h-4 w-4" />, color: "bg-orange-100 text-orange-700" },
    { tag: "spicy", label: "Spicy", icon: <Flame className="h-4 w-4" />, color: "bg-red-100 text-red-700" },
  ]

  const toggleDietaryTag = (tag: DietaryTag) => {
    const newTags = new Set(selectedDietaryTags)
    if (newTags.has(tag)) {
      newTags.delete(tag)
    } else {
      newTags.add(tag)
    }
    onDietaryTagsChange(newTags)
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      {/* Popular Items */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-2 block">Special</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="popular" checked={showPopularOnly} onCheckedChange={onShowPopularOnlyChange} />
          <Label htmlFor="popular" className="flex items-center gap-2 text-sm cursor-pointer">
            <Star className="h-4 w-4 text-yellow-500" />
            Popular items only
          </Label>
        </div>
      </div>

      {/* Availability */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-2 block">Availability</Label>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={availabilityFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onAvailabilityFilterChange("all")}
          >
            All Items
          </Badge>
          <Badge
            variant={availabilityFilter === "available" ? "default" : "outline"}
            className="cursor-pointer bg-green-100 text-green-700 hover:bg-green-200"
            onClick={() => onAvailabilityFilterChange("available")}
          >
            Available
          </Badge>
          <Badge
            variant={availabilityFilter === "limited" ? "default" : "outline"}
            className="cursor-pointer bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            onClick={() => onAvailabilityFilterChange("limited")}
          >
            Limited Stock
          </Badge>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-2 block">Dietary Preferences</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {dietaryOptions.map(({ tag, label, icon, color }) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox id={tag} checked={selectedDietaryTags.has(tag)} onCheckedChange={() => toggleDietaryTag(tag)} />
              <Label htmlFor={tag} className="flex items-center gap-2 text-sm cursor-pointer">
                <span className={`p-1 rounded ${color}`}>{icon}</span>
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
