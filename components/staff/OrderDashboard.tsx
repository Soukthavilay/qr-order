"use client"

import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { OrderSkeleton } from "../ui/LoadingSkeleton"
import { useTranslation } from "../../hooks/useTranslation"
import type { Order, Language } from "../../types"

interface OrderDashboardProps {
  orders: Order[]
  language: Language
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void
  loading?: boolean
}

export function OrderDashboard({ orders, language, onUpdateOrderStatus, loading = false }: OrderDashboardProps) {
  const { t } = useTranslation(language)

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "received":
        return "info"
      case "in_kitchen":
        return "warning"
      case "ready":
        return "success"
      case "served":
        return "default"
      default:
        return "default"
    }
  }

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "received":
        return "in_kitchen"
      case "in_kitchen":
        return "ready"
      case "ready":
        return "served"
      default:
        return null
    }
  }

  const groupedOrders = orders.reduce(
    (acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = []
      }
      acc[order.status].push(order)
      return acc
    },
    {} as Record<Order["status"], Order[]>,
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("orders")} Dashboard</h1>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{orders.filter((o) => o.status !== "served").length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.status === "served").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {(["received", "in_kitchen", "ready", "served"] as Order["status"][]).map((status) => (
          <div key={status} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize flex items-center">
              {status.replace("_", " ")}
              <Badge variant={getStatusBadgeVariant(status)} className="ml-2">
                {groupedOrders[status]?.length || 0}
              </Badge>
            </h2>

            <div className="space-y-3">
              {groupedOrders[status]?.map((order) => {
                const nextStatus = getNextStatus(order.status)
                const orderTime = new Date(order.timestamp)
                const elapsedMinutes = Math.floor((Date.now() - orderTime.getTime()) / (1000 * 60))

                return (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t("table")} {order.tableNumber}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{elapsedMinutes}m ago</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status.replace("_", " ")}</Badge>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                      {order.customerName && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</span>
                      )}
                    </div>

                    {nextStatus && (
                      <Button onClick={() => onUpdateOrderStatus(order.id, nextStatus)} size="sm" className="w-full">
                        Mark as {nextStatus.replace("_", " ")}
                      </Button>
                    )}
                  </div>
                )
              }) || (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No {status.replace("_", " ")} orders
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
