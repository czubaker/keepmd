"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export function SignUpForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`,
      },
    })
    if (error) throw error
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await signUp(email, password)
      setIsSubmitted(true)
      toast({
        title: t("auth.signUpSuccess"),
        description: t("auth.checkEmail"),
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("auth.signUpFailed"),
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // After successful signup, show a message instead of redirecting
  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.checkEmail")}</CardTitle>
          <CardDescription>{t("auth.confirmEmailSent")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.signUp")}</CardTitle>
        <CardDescription>{t("auth.enterCredentials")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="mail@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} onClick={onSubmit}>
          {isLoading ? t("auth.signingUp") + "..." : t("auth.signUp")}
        </Button>
      </CardFooter>
    </Card>
  )
}
