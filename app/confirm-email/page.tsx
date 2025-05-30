"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-context"

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setStatus("error")
          setMessage("Email confirmation failed")
          return
        }

        if (data.session) {
          setStatus("success")
          setMessage("Email confirmed successfully!")
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Email confirmation failed")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred during email confirmation")
      }
    }

    handleEmailConfirmation()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
            {t("auth.emailConfirmation")}
          </CardTitle>
          <CardDescription>
            {status === "loading" && t("auth.confirmingEmail")}
            {status === "success" && t("auth.emailConfirmed")}
            {status === "error" && t("auth.emailConfirmationFailed")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{message}</p>
          {status === "success" && <p className="text-sm text-muted-foreground">{t("auth.redirectingToApp")}</p>}
          {status === "error" && (
            <Button asChild>
              <Link href="/login">{t("auth.backToLogin")}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
