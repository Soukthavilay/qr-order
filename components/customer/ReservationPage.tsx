"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useTranslation } from "../../hooks/useTranslation"
import type { Language, Reservation } from "../../types"

interface ReservationPageProps {
  language: Language
  onCreateReservation: (reservation: Omit<Reservation, "id" | "status">) => void
}

export function ReservationPage({ language, onCreateReservation }: ReservationPageProps) {
  const { t } = useTranslation(language)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    date: "",
    time: "",
    partySize: 2,
    specialRequests: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateReservation(formData)
    setIsSubmitted(true)
    setFormData({
      customerName: "",
      customerPhone: "",
      date: "",
      time: "",
      partySize: 2,
      specialRequests: "",
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reservation Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We'll confirm your reservation shortly and send you a confirmation message.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>Make Another Reservation</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("reservations")}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("name")}</label>
              <Input
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("phone")}</label>
              <Input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("date")}</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("time")}</label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("partySize")}
              </label>
              <select
                value={formData.partySize}
                onChange={(e) => handleInputChange("partySize", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Any special requests or dietary requirements..."
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t("submit")} Reservation
          </Button>
        </form>
      </div>
    </div>
  )
}
