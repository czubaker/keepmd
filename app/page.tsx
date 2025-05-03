"use client"

import { useEffect, useState, useRef } from "react"
import { NoteForm } from "@/components/note-form"
import { NotesGrid } from "@/components/notes-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchFilter } from "@/components/search-filter"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { Footer } from "@/components/footer"

export default function Home() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()
  const isMobile = useMobile()
  const [showEmail, setShowEmail] = useState(false)
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const handleUserIconClick = () => {
    if (isMobile && user) {
      setShowEmail(true)

      // Clear any existing timeout
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current)
      }

      // Hide email after 3 seconds
      emailTimeoutRef.current = setTimeout(() => {
        setShowEmail(false)
      }, 3000)
    }
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Keepmd</h1>
        <p className="mb-8 text-center max-w-md">
          A Google Keep clone with markdown support. Sign in to create and manage your notes.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
        <img src="/keepmd.svg" alt="KeepMD logo" className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Keepmd</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 relative">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleUserIconClick}>
              <User className="h-4 w-4" />
            </Button>
            {(!isMobile || showEmail) && (
              <span
                className={`text-sm transition-opacity duration-300 ${showEmail ? "opacity-100" : ""} ${isMobile ? "absolute left-10 bg-background/90 p-2 rounded shadow-md" : ""}`}
              >
                {user.email}
              </span>
            )}
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <NoteForm />
      <SearchFilter />
      <NotesGrid />
      <Footer />
    </div>
  )
}
