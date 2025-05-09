"use client"

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center bg-muted/30 rounded-md p-1">
      <button
        onClick={() => setTheme("dark")}
        className={cn("p-1.5 rounded-sm", theme === "dark" ? "bg-background shadow-sm" : "text-muted-foreground")}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("light")}
        className={cn("p-1.5 rounded-sm", theme === "light" ? "bg-background shadow-sm" : "text-muted-foreground")}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn("p-1.5 rounded-sm", theme === "system" ? "bg-background shadow-sm" : "text-muted-foreground")}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  )
}
