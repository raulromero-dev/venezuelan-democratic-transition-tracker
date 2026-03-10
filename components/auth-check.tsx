"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const publicRoutes = ["/", "/login"]

  useEffect(() => {
    const checkAuth = async () => {
      if (publicRoutes.includes(pathname)) {
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify")
        const data = await response.json()

        setIsAuthenticated(data.authenticated)
        setIsLoading(false)

        if (!data.authenticated && !publicRoutes.includes(pathname)) {
          router.push("/login")
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        setIsAuthenticated(false)
        setIsLoading(false)
        if (!publicRoutes.includes(pathname)) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null
  }

  return <>{children}</>
}

export function useAuth() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return { logout }
}
