"use client"

import { NewPasswordForm } from "@/components/auth/new-password-form"
import { useLanguage } from "@/components/language-context"

export default function ResetPasswordPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8">{t("app.title")}</h1>
      <NewPasswordForm />
    </div>
  )
}
