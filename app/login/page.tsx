"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { useLanguage } from "@/components/language-context"

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8">{t("app.title")}</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-muted-foreground">
        {t("auth.dontHaveAccount")}{" "}
        <Link href="/signup" className="text-primary hover:underline">
          {t("auth.signup")}
        </Link>
      </p>
    </div>
  )
}
