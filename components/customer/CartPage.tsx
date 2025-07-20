"use client"

import { Button } from "../ui/button"
import { useLanguage } from "../../hooks/use-language"
import type { CartItem } from "../../types"

interface CartPageProps {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onPlaceOrder: () => void
  onClearCart: () => void
}

export function CartPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
}: CartPageProps) {
  const { t } = useLanguage()

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getItemName = (item: CartItem) => {
    return item.name
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400">Add some delicious items from our menu!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("cart")}</h1>
        <Button variant="ghost" onClick={onClearCart}>
          Clear All
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={getItemName(item)}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{getItemName(item)}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                  -
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button variant="secondary" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </Button>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">{t("total")}</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>

        <Button onClick={onPlaceOrder} className="w-full" size="lg">
          🛒 {t("placeOrder")}
        </Button>
      </div>
    </div>
  )
}
