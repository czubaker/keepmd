"use client"

import { PasswordResetForm } from "@/components/auth/password-reset-form"
import Link from "next/link"
import { useLanguage } from "@/components/language-context"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8">{t("app.title")}</h1>
      <PasswordResetForm />
      <p className="mt-4 text-sm text-muted-foreground">
        {t("auth.rememberPassword")}{" "}
        <Link href="/login" className="text-primary hover:underline">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </div>
  )
}
