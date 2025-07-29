"use client"

import { Button } from "../ui/Button"
import { useTranslation } from "../../hooks/useTranslation"
import type { Language, Theme, User } from "../../types"

interface HeaderProps {
  currentPage: string
  user: User | null
  language: Language
  theme: Theme
  onPageChange: (page: string) => void
  onLanguageChange: (language: Language) => void
  onThemeChange: (theme: Theme) => void
  onLogout: () => void
}

export function Header({
  currentPage,
  user,
  language,
  theme,
  onPageChange,
  onLanguageChange,
  onThemeChange,
  onLogout,
}: HeaderProps) {
  const { t } = useTranslation(language) // test commit 

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ]

  const getNavItems = () => {
    if (!user) {
      // Customer/Guest navigation - only customer-facing features
      return [
        { key: "menu", label: t("menu") },
        { key: "cart", label: t("cart") },
        { key: "reservations", label: t("reservations") },
        { key: "reviews", label: t("reviews") },
      ]
    }

    switch (user.role) {
      case "admin":
        return [
          { key: "analytics", label: t("analytics") },
          { key: "menu-management", label: "Menu Management" },
          { key: "language-manager", label: "Language Manager" },
          { key: "inventory", label: t("inventory") },
          { key: "orders", label: t("orders") },
          { key: "pos", label: t("pos") }, // Added for admin
        ]
      case "waiter":
        return [
          { key: "orders", label: t("orders") },
          { key: "reservations", label: t("reservations") },
          { key: "inventory", label: t("inventory") },
          { key: "pos", label: t("pos") }, // Added for waiter
        ]
      case "kitchen":
        return [{ key: "kitchen", label: t("kitchen") }]
      case "customer":
        return [
          { key: "menu", label: t("menu") },
          { key: "cart", label: t("cart") },
          { key: "order-tracking", label: "Order Tracking" },
          { key: "reservations", label: t("reservations") },
          { key: "reviews", label: t("reviews") },
        ]
      default:
        // Default to customer navigation for any unknown role
        return [
          { key: "menu", label: t("menu") },
          { key: "cart", label: t("cart") },
          { key: "reservations", label: t("reservations") },
          { key: "reviews", label: t("reviews") },
        ]
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">🍽️ RestaurantOS</h1>

            <nav className="hidden md:flex space-x-4">
              {getNavItems().map((item) => (
                <button
                  key={item.key}
                  onClick={() => onPageChange(item.key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.key
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "🌙" : "☀️"}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => onPageChange("login")}>
                {t("login")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 py-3 space-y-1">
          {getNavItems().map((item) => (
            <button
              key={item.key}
              onClick={() => onPageChange(item.key)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                currentPage === item.key
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
