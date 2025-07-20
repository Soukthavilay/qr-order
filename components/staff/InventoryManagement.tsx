"use client"

import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Badge } from "../ui/Badge"
import { useTranslation } from "../../hooks/useTranslation"
import type { InventoryItem, Language } from "../../types"

interface InventoryManagementProps {
  inventory: InventoryItem[]
  language: Language
  onUpdateStock: (itemId: string, stock: number) => void
}

export function InventoryManagement({ inventory, language, onUpdateStock }: InventoryManagementProps) {
  const { t } = useTranslation(language)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newStock, setNewStock] = useState<number>(0)

  const handleUpdateStock = (itemId: string) => {
    onUpdateStock(itemId, newStock)
    setEditingItem(null)
    setNewStock(0)
  }

  const startEditing = (item: InventoryItem) => {
    setEditingItem(item.id)
    setNewStock(item.currentStock)
  }

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("inventory")} Management</h1>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Low Stock</div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Low Stock Alert</h2>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <Badge key={item.id} variant="danger">
                {item.name} ({item.currentStock} {item.unit})
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {inventory.map((item) => {
                const isLowStock = item.currentStock <= item.minStock
                const isEditing = editingItem === item.id

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="default">{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">{item.unit}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {item.currentStock} {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={isLowStock ? "danger" : "success"}>{isLowStock ? "Low Stock" : "In Stock"}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleUpdateStock(item.id)}>
                            {t("save")}
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => setEditingItem(null)}>
                            {t("cancel")}
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => startEditing(item)}>
                          {t("edit")}
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
