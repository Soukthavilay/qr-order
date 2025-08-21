"use client"

import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "../types"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveFromCart: (id: number) => void
  totalPrice: number
  onClearCart: () => void
  onPlaceOrder: () => void
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  totalPrice,
  onClearCart,
  onPlaceOrder,
}: CartDrawerProps) {
  const formatPrice = (price: number) => `₭${price.toLocaleString()}`

  const handlePlaceOrder = () => {
    onPlaceOrder()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Order</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some delicious items from our menu!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-15 h-15 object-cover rounded mr-3 border"
                        />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromCart(Number(item.id))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(Number(item.id), item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(Number(item.id), item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-orange-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (sticky) */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-600">{formatPrice(totalPrice)}</span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
              size="lg"
            >
              🛒 Place Order
            </Button>

            <Button onClick={onClearCart} variant="outline" className="w-full mt-2" size="sm">
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
