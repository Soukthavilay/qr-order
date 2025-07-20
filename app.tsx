"use client"

import { useState, useEffect } from "react"
import { MenuPage } from "./components/menu-page"
import { AdminDashboard } from "./components/admin-dashboard"
import { CartDrawer } from "./components/cart-drawer"
import { IntegrationPanel } from "./components/integration-panel"
import { InventoryManagement } from "./components/inventory-management"
import { ReservationSystem } from "./components/reservation-system"
import { ReviewSystem } from "./components/review-system"
import { OrderTracking } from "./components/order-tracking"
import { LanguageSelector } from "./components/language-selector"
import { LoginPage } from "./components/admin/LoginPage"
import { PosPage } from "./components/staff/PosPage"
import { AnalyticsDashboard } from "./components/admin/AnalyticsDashboard"
import { KitchenDisplay } from "./components/staff/KitchenDisplay"
import { CartPage } from "./components/customer/CartPage"
import { LanguageProvider, useLanguage } from "./hooks/use-language"
import { useCart } from "./hooks/use-cart"
import type { User, CartItem } from "./types"

// Import Order type from types
import type { Order } from "./types"

type Page = "menu" | "dashboard" | "analytics" | "integrations" | "inventory" | "reservations" | "reviews" | "tracking" | "login" | "pos" | "kitchen" | "cart"

function RestaurantAppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("menu")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-1",
      tableNumber: "3",
      items: [
        { id: "1", name: "Pad Thai", price: 45000, image: "", description: "", category: "", available: true, popular: true, stock: 0, dietaryTags: [], translations: {}, quantity: 2 },
        { id: "2", name: "Tom Yum Soup", price: 35000, image: "", description: "", category: "", available: true, popular: true, stock: 0, dietaryTags: [], translations: {}, quantity: 1 }
      ],
      total: 125000,
      status: "received",
      timestamp: new Date().toISOString(),
      customerName: "Table 3",
      estimatedTime: 20
    }
  ])
  const [tableNumber, setTableNumber] = useState<string>("1")
  const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { t } = useLanguage()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("restaurant-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("restaurant-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("restaurant-user")
    }
  }, [user])

  // Simple routing based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Page
      if (["dashboard", "analytics", "integrations", "inventory", "reservations", "reviews", "tracking", "login", "pos", "kitchen", "cart"].includes(hash)) {
        setCurrentPage(hash)
      } else {
        setCurrentPage("menu")
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const navigateTo = (page: Page) => {
    window.location.hash = page === "menu" ? "" : page
    setCurrentPage(page)
  }

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    navigateTo("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    navigateTo("menu")
  }

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableNumber: tableNumber,
      items: cartItems,
      total: getTotalPrice(),
      status: "received",
      timestamp: new Date().toISOString(),
      customerName: `Table ${tableNumber}`,
      estimatedTime: 20
    }

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    setIsCartOpen(false)
    alert(`Order placed successfully! 🎉\nOrder ID: ${newOrder.id}\nTable: ${newOrder.tableNumber}`)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const renderCurrentPage = () => {
    // Check if user needs to be logged in for admin pages
    const adminPages = ["dashboard", "analytics", "integrations", "inventory", "pos", "kitchen"]
    if (adminPages.includes(currentPage) && !user) {
      return <LoginPage language="en" onLogin={handleLogin} />
    }

    switch (currentPage) {
      case "menu":
        return (
          <MenuPage
            cartItems={cartItems}
            onAddToCart={addToCart}
            onOpenCart={() => setIsCartOpen(true)}
            totalItems={getTotalItems()}
          />
        )
      case "dashboard":
        return <AdminDashboard />
      case "analytics":
        return <AnalyticsDashboard orders={orders} reviews={[]} />
      case "integrations":
        return <IntegrationPanel />
      case "inventory":
        return <InventoryManagement />
      case "reservations":
        return <ReservationSystem />
      case "reviews":
        return <ReviewSystem />
      case "tracking":
        return <OrderTracking />
      case "pos":
        return <PosPage />
      case "kitchen":
        return <KitchenDisplay orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
      case "cart":
        return (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={(id, quantity) => updateQuantity(Number(id), quantity)}
            onRemoveItem={(id) => removeFromCart(Number(id))}
            onPlaceOrder={() => {
              alert("Order placed successfully! 🎉")
              clearCart()
            }}
            onClearCart={clearCart}
          />
        )
      case "login":
        return <LoginPage language="en" onLogin={handleLogin} />
      default:
        return (
          <MenuPage
            cartItems={cartItems}
            onAddToCart={addToCart}
            onOpenCart={() => setIsCartOpen(true)}
            totalItems={getTotalItems()}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">🍜 Nom Nom Cafe</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Table:</span>
                <input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                  min="1"
                />
              </div>
              <div className="hidden lg:flex gap-2">
                {[
                  { key: "menu", label: t("menu") },
                  { key: "dashboard", label: t("dashboard") },
                  { key: "analytics", label: t("analytics") },
                  { key: "pos", label: t("pos") },
                  { key: "kitchen", label: t("kitchen") },
                  { key: "cart", label: t("cart") },
                  { key: "tracking", label: t("tracking") },
                  { key: "reservations", label: t("reservations") },
                  { key: "reviews", label: t("reviews") },
                  { key: "inventory", label: t("inventory") },
                  { key: "integrations", label: t("integrations") },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => navigateTo(key as Page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === key ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo("login")}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{renderCurrentPage()}</main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        totalPrice={getTotalPrice()}
        onClearCart={clearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 text-xs">
          {[
            { key: "menu", label: t("menu"), icon: "🍽️" },
            { key: "dashboard", label: t("dashboard"), icon: "📊" },
            { key: "tracking", label: t("tracking"), icon: "🚀" },
            { key: "reservations", label: t("reservations"), icon: "📅" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => navigateTo(key as Page)}
              className={`py-3 px-2 text-center font-medium transition-colors ${
                currentPage === key ? "text-orange-600 bg-orange-50" : "text-gray-600"
              }`}
            >
              <div>{icon}</div>
              <div className="mt-1">{label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RestaurantApp() {
  return (
    <LanguageProvider>
      <RestaurantAppContent />
    </LanguageProvider>
  )
}
