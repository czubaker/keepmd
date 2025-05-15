"use client"
import { useLanguage } from "./language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="py-6 border-t mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          {t("app.title")} - {t("app.tagline")}
        </p>
      </div>
    </footer>
  )
}
