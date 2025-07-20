"use client"

import { useState } from "react"
import { Search, QrCode, Printer, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockOrders } from "../../data/mockData" // Using mockData for orders
import type { Order } from "../../types"
import { useTranslation } from "../../hooks/useTranslation"
import type { Language } from "../../types"

interface PosPageProps {
  language: Language
}

export function PosPage({ language }: PosPageProps) {
  const { t } = useTranslation(language)
  const [tableNumberInput, setTableNumberInput] = useState("")
  const [foundOrder, setFoundOrder] = useState<Order | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const formatPrice = (price: number) =>
    `₭${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const handleSearchBill = () => {
    setSearchError(null)
    setFoundOrder(null) // Clear previous search result

    const tableNum = tableNumberInput.trim()
    if (!tableNum) {
      setSearchError("Please enter a table number.")
      return
    }

    // Find an order that is not yet served for the given table number
    const order = mockOrders.find(
      (o) => o.tableNumber.toLowerCase() === tableNum.toLowerCase() && o.status !== "served",
    )

    if (order) {
      setFoundOrder(order)
    } else {
      setSearchError(`No active bill found for Table ${tableNum}.`)
    }
  }

  const handleMarkAsPaid = () => {
    if (foundOrder) {
      // In a real application, this would update the order status in the backend
      alert(`Bill for Table ${foundOrder.tableNumber} marked as paid!`)
      setFoundOrder(null) // Clear the bill after marking as paid
      setTableNumberInput("")
    }
  }

  const handlePrintBill = () => {
    if (foundOrder) {
      alert(`Printing bill for Table ${foundOrder.tableNumber}... (UI only)`)
      // In a real application, this would trigger a print action
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 {t("pos")} System</h1>
        <p className="text-gray-600">Manage customer bills and payments</p>
      </div>

      {/* Top Section: Search Bill */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Bill</CardTitle>
          <CardDescription>Enter the table number to retrieve the bill.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Enter Table Number (e.g., Table 3)"
            value={tableNumberInput}
            onChange={(e) => setTableNumberInput(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchBill()
              }
            }}
          />
          <Button onClick={handleSearchBill} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Bill
          </Button>
        </CardContent>
      </Card>

      {searchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6">{searchError}</div>
      )}

      {foundOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bill Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Bill for Table {foundOrder.tableNumber}</CardTitle>
              <CardDescription>Order ID: {foundOrder.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {foundOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.name} x{item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-xl">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPrice(foundOrder.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>Choose how the customer wants to pay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="flex flex-col items-center">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="QR Code"
                  className="w-48 h-48 object-contain mb-4 border rounded-lg p-2"
                />
                <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <QrCode className="h-5 w-5" /> Scan to Pay
                </p>
                <Badge variant="info" className="mt-2">
                  Mobile Payment
                </Badge>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleMarkAsPaid}
                  className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5" /> Mark as Paid
                </Button>
                <Button
                  onClick={handlePrintBill}
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-transparent"
                  size="lg"
                >
                  <Printer className="h-5 w-5" /> Print Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
