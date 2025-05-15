"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

export type DesignSystem = "default" | "ios" | "material"

interface DesignContextType {
  designSystem: DesignSystem
  setDesignSystem: (design: DesignSystem) => void
}

const DesignContext = createContext<DesignContextType | undefined>(undefined)

export function DesignProvider({ children }: { children: ReactNode }) {
  const [designSystem, setDesignSystemState] = useState<DesignSystem>("default")

  useEffect(() => {
    // Load design preference from localStorage on mount
    const savedDesign = localStorage.getItem("designSystem") as DesignSystem
    if (savedDesign && ["default", "ios", "material"].includes(savedDesign)) {
      setDesignSystemState(savedDesign)
    }
  }, [])

  const setDesignSystem = (design: DesignSystem) => {
    setDesignSystemState(design)
    localStorage.setItem("designSystem", design)

    // Apply design-specific classes to the document
    document.documentElement.classList.remove("design-default", "design-ios", "design-material")
    document.documentElement.classList.add(`design-${design}`)
  }

  return <DesignContext.Provider value={{ designSystem, setDesignSystem }}>{children}</DesignContext.Provider>
}

export function useDesign() {
  const context = useContext(DesignContext)
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider")
  }
  return context
}
