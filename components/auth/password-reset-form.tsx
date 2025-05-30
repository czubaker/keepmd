"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client" // Fixed import path
import { useLanguage } from "@/components/language-context"

export function PasswordResetForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast({
          title: t("auth.error"),
          description: error.message,
          variant: "destructive",
        })
      } else {
        setIsSubmitted(true)
        toast({
          title: t("auth.passwordResetSent"),
          description: t("auth.passwordResetSentDescription"),
        })
      }
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: t("auth.unexpectedError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.checkEmail")}</CardTitle>
          <CardDescription>{t("auth.passwordResetEmailSent")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.resetPassword")}</CardTitle>
        <CardDescription>{t("auth.resetPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("auth.sending") : t("auth.sendResetLink")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
