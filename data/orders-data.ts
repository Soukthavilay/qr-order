import type { Order } from "../types"

export const mockOrders: Order[] = [
  {
    id: "order-1",
    tableNumber: "3",
    orderTime: "17:32",
    items: [
      { name: "Pad Thai", quantity: 2, price: 45000 },
      { name: "Tom Yum Soup", quantity: 1, price: 35000 },
    ],
    total: 125000,
    status: "pending",
  },
  {
    id: "order-2",
    tableNumber: "7",
    orderTime: "17:28",
    items: [
      { name: "Green Curry", quantity: 1, price: 50000 },
      { name: "Spring Rolls", quantity: 2, price: 20000 },
      { name: "Mango Sticky Rice", quantity: 1, price: 25000 },
    ],
    total: 115000,
    status: "pending",
  },
  {
    id: "order-3",
    tableNumber: "1",
    orderTime: "17:15",
    items: [
      { name: "Beef Pho", quantity: 1, price: 55000 },
      { name: "Spring Rolls", quantity: 1, price: 20000 },
    ],
    total: 75000,
    status: "served",
  },
  {
    id: "order-4",
    tableNumber: "5",
    orderTime: "17:10",
    items: [
      { name: "Larb Gai", quantity: 1, price: 40000 },
      { name: "Massaman Curry", quantity: 1, price: 48000 },
    ],
    total: 88000,
    status: "served",
  },
  {
    id: "order-5",
    tableNumber: "2",
    orderTime: "16:58",
    items: [
      { name: "Tom Yum Soup", quantity: 2, price: 35000 },
      { name: "Pad Thai", quantity: 1, price: 45000 },
    ],
    total: 115000,
    status: "pending",
  },
]
