"use client"

import { useState } from "react"
import { Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockOrders } from "../data/orders-data"
import type { Order } from "../types"

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const toggleOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: order.status === "pending" ? "served" : "pending" } : order,
      ),
    )
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const servedOrders = orders.filter((order) => order.status === "served")

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ Orders Dashboard</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{pendingOrders.length} pending</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{orders.length} total orders</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Orders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Orders ({pendingOrders.length})</h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} onToggleStatus={toggleOrderStatus} />
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Served Orders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Served Orders ({servedOrders.length})</h2>
          <div className="space-y-4">
            {servedOrders.map((order) => (
              <OrderCard key={order.id} order={order} onToggleStatus={toggleOrderStatus} />
            ))}
            {servedOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No served orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onToggleStatus: (orderId: string) => void
}

function OrderCard({ order, onToggleStatus }: OrderCardProps) {
  const formatPrice = (price: number) => `₭${price.toLocaleString()}`

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Table {order.tableNumber}</h3>
          <Badge
            variant={order.status === "pending" ? "destructive" : "default"}
            className={order.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}
          >
            {order.status === "pending" ? "Pending" : "Served"}
          </Badge>
        </div>
        <span className="text-sm text-gray-500">{order.orderTime}</span>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} x{item.quantity}
              </span>
              <span className="text-gray-900 font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-orange-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onToggleStatus(order.id)}
        variant={order.status === "pending" ? "default" : "outline"}
        size="sm"
        className="w-full"
      >
        {order.status === "pending" ? "Mark as Served" : "Mark as Pending"}
      </Button>
    </div>
  )
}
