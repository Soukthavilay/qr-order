"use client"

import { useState, useEffect } from "react"
import type { AppState, CartItem, Order, Language, Theme, User } from "../types"
import { mockOrders, mockReservations, mockReviews, mockInventory } from "../data/mockData"

const STORAGE_KEYS = {
  CART: "restaurant-cart",
  LANGUAGE: "restaurant-language",
  THEME: "restaurant-theme",
  USER: "restaurant-user",
}

export function useApp() {
  const [state, setState] = useState<AppState>({
    currentPage: "menu",
    user: null,
    language: "en",
    theme: "light",
    cart: [],
    orders: mockOrders,
    reservations: mockReservations,
    reviews: mockReviews,
    inventory: mockInventory,
  })

  // Load persisted data on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART)
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)

    setState((prev) => ({
      ...prev,
      cart: savedCart ? JSON.parse(savedCart) : [],
      language: (savedLanguage as Language) || "en",
      theme: (savedTheme as Theme) || "light",
      user: savedUser ? JSON.parse(savedUser) : null,
    }))
  }, [])

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart))
  }, [state.cart])

  // Persist language changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language)
  }, [state.language])

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme)
    document.documentElement.classList.toggle("dark", state.theme === "dark")
  }, [state.theme])

  // Persist user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }, [state.user])

  const actions = {
    setCurrentPage: (page: string) => {
      setState((prev) => ({ ...prev, currentPage: page }))
    },

    setUser: (user: User | null) => {
      setState((prev) => ({ ...prev, user }))
    },

    setLanguage: (language: Language) => {
      setState((prev) => ({ ...prev, language }))
    },

    setTheme: (theme: Theme) => {
      setState((prev) => ({ ...prev, theme }))
    },

    addToCart: (item: CartItem) => {
      setState((prev) => {
        const existingItem = prev.cart.find((cartItem) => cartItem.id === item.id)
        if (existingItem) {
          return {
            ...prev,
            cart: prev.cart.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
            ),
          }
        }
        return { ...prev, cart: [...prev.cart, item] }
      })
    },

    updateCartItem: (id: string, quantity: number) => {
      setState((prev) => ({
        ...prev,
        cart:
          quantity > 0
            ? prev.cart.map((item) => (item.id === id ? { ...item, quantity } : item))
            : prev.cart.filter((item) => item.id !== id),
      }))
    },

    removeFromCart: (id: string) => {
      setState((prev) => ({
        ...prev,
        cart: prev.cart.filter((item) => item.id !== id),
      }))
    },

    clearCart: () => {
      setState((prev) => ({ ...prev, cart: [] }))
    },

    addOrder: (order: Order) => {
      setState((prev) => ({ ...prev, orders: [...prev.orders, order] }))
    },

    updateOrderStatus: (orderId: string, status: Order["status"]) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      }))
    },

    updateInventory: (itemId: string, stock: number) => {
      setState((prev) => ({
        ...prev,
        inventory: prev.inventory.map((item) =>
          item.id === itemId ? { ...item, currentStock: stock, lastUpdated: new Date().toISOString() } : item,
        ),
      }))
    },
  }

  return { state, actions }
}
