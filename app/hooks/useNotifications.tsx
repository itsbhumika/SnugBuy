"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  unreadCount: number
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem("notifications")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const notificationsWithDates = parsed.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp),
        }))
        setNotifications(notificationsWithDates)
      } catch (error) {
        console.error("Error loading notifications:", error)
        // Initialize with default notifications
        initializeDefaultNotifications()
      }
    } else {
      initializeDefaultNotifications()
    }
  }, [])

  useEffect(() => {
    // Save notifications to localStorage
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  const initializeDefaultNotifications = () => {
    const defaultNotifications: Notification[] = [
      {
        id: "welcome-1",
        type: "success",
        title: "Welcome to SnugBuy! 🎉",
        message: "Get 50% off your first order with code HM50. Valid for 24 hours!",
        timestamp: new Date(),
        read: false,
        actionUrl: "/",
        actionText: "Shop Now",
      },
      {
        id: "collection-2",
        type: "info",
        title: "New Spring Collection ✨",
        message: "Discover our latest spring arrivals with fresh styles and colors",
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actionUrl: "/?category=new",
        actionText: "View Collection",
      },
      {
        id: "shipping-3",
        type: "info",
        title: "Free Shipping Weekend 🚚",
        message: "Enjoy free shipping on all orders this weekend - no minimum required",
        timestamp: new Date(Date.now() - 7200000),
        read: false,
      },
    ]
    setNotifications(defaultNotifications)
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]) // Keep max 50 notifications
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem("notifications")
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
