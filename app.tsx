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
import { LanguageProvider, useLanguage } from "./hooks/use-language"
import { useCart } from "./hooks/use-cart"
import type { User } from "./types"

type Page = "menu" | "dashboard" | "integrations" | "inventory" | "reservations" | "reviews" | "tracking" | "login" | "pos"

function RestaurantAppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("menu")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
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
      if (["dashboard", "integrations", "inventory", "reservations", "reviews", "tracking", "login", "pos"].includes(hash)) {
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

  const renderCurrentPage = () => {
    // Check if user needs to be logged in for admin pages
    const adminPages = ["dashboard", "integrations", "inventory", "pos"]
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
              <div className="hidden lg:flex gap-2">
                {[
                  { key: "menu", label: t("menu") },
                  { key: "dashboard", label: t("dashboard") },
                  { key: "pos", label: t("pos") },
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
