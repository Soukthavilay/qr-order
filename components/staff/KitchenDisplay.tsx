"use client"

import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useLanguage } from "../../hooks/use-language"
import type { Order } from "../../types"

interface KitchenDisplayProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void
}

export function KitchenDisplay({ orders, onUpdateOrderStatus }: KitchenDisplayProps) {
  const { t } = useLanguage()

  const activeOrders = orders
    .filter((order) => order.status === "received" || order.status === "in_kitchen")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🍳 {t("kitchen")} Display</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{activeOrders.length} active orders</p>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">No orders in the kitchen right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => {
              const orderTime = new Date(order.timestamp)
              const elapsedMinutes = Math.floor((Date.now() - orderTime.getTime()) / (1000 * 60))
              const isUrgent = elapsedMinutes > 20

              return (
                <div
                  key={order.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 ${
                    isUrgent
                      ? "border-red-500"
                      : order.status === "in_kitchen"
                        ? "border-yellow-500"
                        : "border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("table")} {order.tableNumber}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-400">{elapsedMinutes}m ago</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={order.status === "in_kitchen" ? "secondary" : "default"} className="text-lg px-3 py-1">
                        {order.status === "received" ? "NEW" : "COOKING"}
                      </Badge>
                      {isUrgent && (
                        <Badge variant="destructive" className="block mt-1">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</span>
                          <span className="text-xl font-bold text-blue-600">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {order.status === "received" && (
                      <Button onClick={() => onUpdateOrderStatus(order.id, "in_kitchen")} className="w-full" size="lg">
                        🔥 Start Cooking
                      </Button>
                    )}
                    {order.status === "in_kitchen" && (
                      <Button
                        onClick={() => onUpdateOrderStatus(order.id, "ready")}
                        variant="secondary"
                        className="w-full"
                        size="lg"
                      >
                        ✅ Mark Ready
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
