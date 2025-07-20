"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import LoadingSpinner from "./LoadingSpinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (adminOnly && user.role !== "admin") {
        router.push("/")
        return
      }
    }
  }, [user, isLoading, router, adminOnly])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user || (adminOnly && user.role !== "admin")) {
    return null
  }

  return <>{children}</>
}
