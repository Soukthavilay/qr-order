"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useLanguage } from "../../hooks/use-language"
import { mockUsers } from "../../data/mockData"
import type { Language, User } from "../../types"

interface LoginPageProps {
  language: Language
  onLogin: (user: User) => void
}

export function LoginPage({ language, onLogin }: LoginPageProps) {
  const { t } = useLanguage()
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple mock authentication
    const user = mockUsers.find((u) => u.username === credentials.username)

    if (user && credentials.password === "password") {
      onLogin(user)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center text-6xl mb-4">🍽️</div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">RestaurantOS</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <Button type="submit" className="w-full" size="lg">
            {t("login")}
          </Button>
        </form>

        <div className="mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div>Admin: admin / password</div>
              <div>Waiter: waiter1 / password</div>
              <div>Kitchen: chef1 / password</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
