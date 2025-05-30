"use client"

import { PasswordResetForm } from "@/components/auth/password-reset-form"
import { useLanguage } from "@/components/language-context"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8">{t("app.title")}</h1>
      <PasswordResetForm />
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          {t("auth.rememberPassword")} {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  )
}
