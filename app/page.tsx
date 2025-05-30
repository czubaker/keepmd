"use client"

import { useState, useEffect } from "react"
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
import { useLanguage } from "@/components/language-context"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Force a re-render when user state changes
    if (user && !isLoading) {
      // User is authenticated, ensure we're showing the notes interface
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">{t("app.title")}</h1>
        <p className="mb-8 text-center max-w-md">{t("app.tagline")}</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">{t("auth.login")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">{t("auth.signup")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t("app.title")}</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} title={t("settings.settings")}>
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
