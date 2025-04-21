"use client"

import { NoteForm } from "@/components/note-form"
import { NotesGrid } from "@/components/notes-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchFilter } from "@/components/search-filter"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

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
        <h1 className="text-3xl font-bold mb-8">Markdown Notes</h1>
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
        <h1 className="text-2xl font-bold">Markdown Notes</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{user.email}</span>
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
    </div>
  )
}
