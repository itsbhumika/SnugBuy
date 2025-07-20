"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TooltipContextType {
  showTooltip: (text: string, element: HTMLElement) => void
  hideTooltip: () => void
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined)

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const showTooltip = (text: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip && (
        <div
          className="fixed z-[9999] bg-black text-white text-xs px-2 py-1 rounded pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </TooltipContext.Provider>
  )
}

export function useTooltip() {
  const context = useContext(TooltipContext)
  if (context === undefined) {
    throw new Error("useTooltip must be used within a TooltipProvider")
  }
  return context
}
