"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useLanguage } from "@/components/language-context"
import { Loader2 } from "lucide-react"

export default function ConfirmEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        })

        if (error) {
          setError(error.message)
          toast({
            title: t("auth.error"),
            description: error.message,
            variant: "destructive",
          })
        } else {
          setIsConfirmed(true)
          toast({
            title: t("auth.success"),
            description: t("auth.emailConfirmed"),
          })
        }
      } else {
        setError(t("auth.invalidConfirmationLink"))
      }
      setIsLoading(false)
    }

    confirmEmail()
  }, [searchParams, toast, t])

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            {t("auth.confirmingEmail")}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8">{t("app.title")}</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isConfirmed ? t("auth.emailConfirmed") : t("auth.confirmationFailed")}</CardTitle>
          <CardDescription>
            {isConfirmed ? t("auth.emailConfirmedDescription") : error || t("auth.confirmationFailedDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push(isConfirmed ? "/" : "/login")} className="w-full">
            {isConfirmed ? t("auth.goToApp") : t("auth.backToLogin")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
