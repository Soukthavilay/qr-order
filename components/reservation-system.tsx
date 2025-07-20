"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "../hooks/use-language"
import type { Reservation } from "../types"

const mockReservations: Reservation[] = [
  {
    id: "res-1",
    customerName: "John Smith",
    customerPhone: "+856 20 1234567",
    customerEmail: "john@example.com",
    date: "2024-01-20",
    time: "19:00",
    partySize: 4,
    tableNumber: "5",
    status: "confirmed",
    specialRequests: "Window seat preferred",
  },
  {
    id: "res-2",
    customerName: "Sarah Johnson",
    customerPhone: "+856 20 7654321",
    customerEmail: "sarah@example.com",
    date: "2024-01-20",
    time: "20:30",
    partySize: 2,
    status: "pending",
    specialRequests: "Anniversary dinner",
  },
  {
    id: "res-3",
    customerName: "Mike Chen",
    customerPhone: "+856 20 9876543",
    customerEmail: "mike@example.com",
    date: "2024-01-21",
    time: "18:30",
    partySize: 6,
    tableNumber: "8",
    status: "confirmed",
  },
]

export function ReservationSystem() {
  const { t } = useLanguage()
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const updateReservationStatus = (id: string, status: Reservation["status"]) => {
    setReservations((prev) =>
      prev.map((reservation) => (reservation.id === id ? { ...reservation, status } : reservation)),
    )
  }

  const todayReservations = reservations.filter((res) => res.date === selectedDate)
  const confirmedCount = todayReservations.filter((res) => res.status === "confirmed").length
  const pendingCount = todayReservations.filter((res) => res.status === "pending").length

  const statusConfig = {
    confirmed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    pending: { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
    cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
    completed: { color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 {t("reservations")}</h1>
        <p className="text-gray-600">Manage table reservations and bookings</p>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today's Reservations</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="new">New Reservation</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Today's Reservations</p>
                    <p className="text-2xl font-bold">{todayReservations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Guests</p>
                    <p className="text-2xl font-bold">
                      {todayReservations.reduce((sum, res) => sum + res.partySize, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-4">
            <Label htmlFor="date">Select Date:</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>

          {/* Reservations List */}
          <div className="grid gap-4">
            {todayReservations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reservations for this date</h3>
                  <p className="text-gray-600">Create a new reservation to get started</p>
                </CardContent>
              </Card>
            ) : (
              todayReservations
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((reservation) => {
                  const StatusIcon = statusConfig[reservation.status].icon
                  return (
                    <Card key={reservation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold text-lg">{reservation.customerName}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {reservation.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {reservation.partySize} guests
                                </span>
                                {reservation.tableNumber && (
                                  <span className="flex items-center gap-1">
                                    <Badge variant="outline">Table {reservation.tableNumber}</Badge>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge className={statusConfig[reservation.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{reservation.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{reservation.customerEmail}</span>
                          </div>
                        </div>

                        {reservation.specialRequests && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              <strong>Special Requests:</strong> {reservation.specialRequests}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {reservation.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {reservation.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateReservationStatus(reservation.id, "completed")}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {reservations
              .filter((res) => res.date > selectedDate)
              .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
              .map((reservation) => {
                const StatusIcon = statusConfig[reservation.status].icon
                return (
                  <Card key={reservation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{reservation.customerName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{reservation.date}</span>
                            <span>{reservation.time}</span>
                            <span>{reservation.partySize} guests</span>
                          </div>
                        </div>
                        <Badge className={statusConfig[reservation.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Reservation</CardTitle>
              <CardDescription>Add a new table reservation to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <NewReservationForm onAdd={(reservation) => setReservations([...reservations, reservation])} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NewReservationForm({ onAdd }: { onAdd: (reservation: Reservation) => void }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    date: "",
    time: "",
    partySize: 2,
    specialRequests: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      ...formData,
      status: "pending",
    }
    onAdd(newReservation)
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: "",
      time: "",
      partySize: 2,
      specialRequests: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="customerEmail">Email Address</Label>
        <Input
          id="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          required
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="partySize">Party Size</Label>
          <Input
            id="partySize"
            type="number"
            min="1"
            max="20"
            value={formData.partySize}
            onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="Any special requests or notes..."
        />
      </div>
      <Button type="submit" className="w-full">
        Create Reservation
      </Button>
    </form>
  )
}
