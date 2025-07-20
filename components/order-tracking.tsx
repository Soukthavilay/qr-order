"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, Utensils, Bell, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "../hooks/use-language"
import { mockOrders } from "../data/orders-data"
import type { Order } from "../types"

export function OrderTracking() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.map((order) => ({
      ...order,
      status: order.status === "pending" ? "preparing" : order.status,
      estimatedTime: Math.floor(Math.random() * 20) + 10, // 10-30 minutes
      actualTime: order.status === "served" ? Math.floor(Math.random() * 25) + 15 : undefined,
    })),
  )

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "preparing" && Math.random() < 0.1) {
            return { ...order, status: "ready" as const }
          }
          if (order.status === "ready" && Math.random() < 0.2) {
            return {
              ...order,
              status: "served" as const,
              actualTime: order.estimatedTime! + Math.floor(Math.random() * 10) - 5,
            }
          }
          return order
        }),
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              actualTime:
                newStatus === "served" ? order.estimatedTime! + Math.floor(Math.random() * 10) - 5 : order.actualTime,
            }
          : order,
      ),
    )
  }

  const getStatusProgress = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return 0
      case "preparing":
        return 33
      case "ready":
        return 66
      case "served":
        return 100
      default:
        return 0
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700"
      case "preparing":
        return "bg-orange-100 text-orange-700"
      case "ready":
        return "bg-green-100 text-green-700"
      case "served":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "preparing":
        return <Utensils className="h-4 w-4" />
      case "ready":
        return <Bell className="h-4 w-4" />
      case "served":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const activeOrders = orders.filter((order) => order.status !== "served")
  const completedOrders = orders.filter((order) => order.status === "served")

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 {t("tracking")}</h1>
        <p className="text-gray-600">Real-time order tracking and kitchen management</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "preparing").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "ready").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
          <div className="grid gap-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active orders</h3>
                  <p className="text-gray-600">All orders have been completed</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">Table {order.tableNumber}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{t(order.status)}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="h-4 w-4" />
                        <span>Est. {order.estimatedTime} min</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Order Progress</span>
                        <span>{getStatusProgress(order.status)}%</span>
                      </div>
                      <Progress value={getStatusProgress(order.status)} className="h-2" />
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-gray-900 font-medium">
                              ₭{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-orange-600">₭{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {order.status === "preparing" && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "ready")}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          Mark as Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "served")}
                          className="bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          Mark as Served
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Completed Orders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Completed</h2>
          <div className="grid gap-4">
            {completedOrders.slice(0, 3).map((order) => (
              <Card key={order.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">Table {order.tableNumber}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{t(order.status)}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Completed in {order.actualTime} min</p>
                      <p className="font-semibold text-orange-600">₭{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
