"use client"

import { useEffect, useState } from "react"
import { Badge } from "../ui/Badge"
import { useTranslation } from "../../hooks/useTranslation"
import type { Order, Language } from "../../types"

interface OrderTrackingPageProps {
  order: Order | null
  language: Language
}

export function OrderTrackingPage({ order, language }: OrderTrackingPageProps) {
  const { t } = useTranslation(language)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No active order</h2>
          <p className="text-gray-600 dark:text-gray-400">Place an order to track its progress here!</p>
        </div>
      </div>
    )
  }

  const steps = [
    { key: "received", label: "Order Received", icon: "📝" },
    { key: "in_kitchen", label: "In Kitchen", icon: "👨‍🍳" },
    { key: "ready", label: "Ready for Pickup", icon: "🔔" },
    { key: "served", label: "Served", icon: "✅" },
  ]

  const currentStepIndex = steps.findIndex((step) => step.key === order.status)
  const orderTime = new Date(order.timestamp)
  const elapsedMinutes = Math.floor((currentTime.getTime() - orderTime.getTime()) / (1000 * 60))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("table")} {order.tableNumber} • Order #{order.id.slice(-6)}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                  index <= currentStepIndex ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-sm text-center ${
                  index <= currentStepIndex ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div
            className="absolute top-6 left-6 h-0.5 bg-green-500 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
          <Badge variant={order.status === "served" ? "success" : "info"}>
            {order.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name} x{item.quantity}
              </span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between font-semibold">
            <span>{t("total")}</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Time Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{elapsedMinutes}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Minutes Elapsed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{order.estimatedTime || "N/A"}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Minutes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
