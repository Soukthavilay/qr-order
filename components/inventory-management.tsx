"use client"

import type React from "react"

import { useState } from "react"
import { Package, AlertTriangle, TrendingUp, Plus, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "../hooks/use-language"
import type { InventoryItem } from "../types"

const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Rice Noodles",
    category: "Ingredients",
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    unit: "kg",
    supplier: "Local Farm Co.",
    lastRestocked: "2024-01-15",
    cost: 15000,
  },
  {
    id: "inv-2",
    name: "Coconut Milk",
    category: "Ingredients",
    currentStock: 5,
    minStock: 15,
    maxStock: 50,
    unit: "cans",
    supplier: "Thai Imports Ltd.",
    lastRestocked: "2024-01-10",
    cost: 8000,
  },
  {
    id: "inv-3",
    name: "Fresh Shrimp",
    category: "Seafood",
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    unit: "kg",
    supplier: "Ocean Fresh",
    lastRestocked: "2024-01-16",
    cost: 120000,
  },
  {
    id: "inv-4",
    name: "Thai Basil",
    category: "Herbs",
    currentStock: 2,
    minStock: 3,
    maxStock: 10,
    unit: "bunches",
    supplier: "Herb Garden",
    lastRestocked: "2024-01-14",
    cost: 5000,
  },
]

export function InventoryManagement() {
  const { t } = useLanguage()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...new Set(inventoryItems.map((item) => item.category))]

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.minStock)
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.currentStock * item.cost, 0)

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return "low"
    if (item.currentStock >= item.maxStock * 0.8) return "high"
    return "normal"
  }

  const formatPrice = (price: number) => `₭${price.toLocaleString()}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 {t("inventory")}</h1>
        <p className="text-gray-600">Manage your restaurant inventory and stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{inventoryItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatPrice(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search inventory items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>Add a new item to your inventory management system.</DialogDescription>
            </DialogHeader>
            <AddItemForm onAdd={(item) => setInventoryItems([...inventoryItems, item])} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-red-600">
              {lowStockItems.length} items are running low on stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item.id} variant="destructive">
                  {item.name} ({item.currentStock} {item.unit})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your restaurant inventory and stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Supplier</th>
                  <th className="text-left p-2">Value</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item)
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Last restocked: {item.lastRestocked}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">
                            {item.currentStock} {item.unit}
                          </p>
                          <p className="text-sm text-gray-500">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge
                          className={
                            status === "low"
                              ? "bg-red-100 text-red-700"
                              : status === "high"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                          }
                        >
                          {status === "low" ? "Low Stock" : status === "high" ? "Well Stocked" : "Normal"}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm">{item.supplier}</td>
                      <td className="p-2 font-medium">{formatPrice(item.currentStock * item.cost)}</td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddItemForm({ onAdd }: { onAdd: (item: InventoryItem) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    supplier: "",
    cost: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...formData,
      lastRestocked: new Date().toISOString().split("T")[0],
    }
    onAdd(newItem)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="currentStock">Current Stock</Label>
          <Input
            id="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="minStock">Min Stock</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxStock">Max Stock</Label>
          <Input
            id="maxStock"
            type="number"
            value={formData.maxStock}
            onChange={(e) => setFormData({ ...formData, maxStock: Number(e.target.value) })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="kg, pieces, cans, etc."
            required
          />
        </div>
        <div>
          <Label htmlFor="cost">Cost per Unit (₭)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="supplier">Supplier</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Add Item
      </Button>
    </form>
  )
}
