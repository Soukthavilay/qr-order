export interface MenuItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  available: boolean
  popular: boolean
  stock: number
  dietaryTags: DietaryTag[]
  promotions?: Promotion[]
  translations: Record<string, { name: string; description: string }>
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  tableNumber: string
  items: CartItem[]
  total: number
  status: OrderStatus
  timestamp: string
  customerName?: string
  customerPhone?: string
  estimatedTime?: number
  actualTime?: number
}

export interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  status: ReservationStatus
  specialRequests?: string
}

export interface Review {
  id: string
  orderId: string
  customerName: string
  rating: number
  comment: string
  timestamp: string
}

export interface InventoryItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  category: string
  unit: string
  lastUpdated: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  category?: string
  validUntil: string
}

export interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

export type OrderStatus = "received" | "in_kitchen" | "ready" | "served"
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"
export type DietaryTag = "vegan" | "vegetarian" | "gluten_free" | "dairy_free" | "nut_free" | "halal"
export type UserRole = "admin" | "waiter" | "kitchen" | "customer"
export type Language = "en" | "es" | "fr" | "de"
export type Theme = "light" | "dark"

export interface AppState {
  currentPage: string
  user: User | null
  language: Language
  theme: Theme
  cart: CartItem[]
  orders: Order[]
  reservations: Reservation[]
  reviews: Review[]
  inventory: InventoryItem[]
}
