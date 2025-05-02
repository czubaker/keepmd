import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8">Keepmd</h1>
      <SignupForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
