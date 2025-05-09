"use client"

import { useState } from "react"
import { NoteForm } from "@/components/note-form"
import { NotesGrid } from "@/components/notes-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchFilter } from "@/components/search-filter"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { SettingsDialog } from "@/components/settings-dialog"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
        <h1 className="text-2xl font-bold">Keepmd</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <NoteForm />
      <SearchFilter />
      <NotesGrid />
      <Footer />

      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  )
}
