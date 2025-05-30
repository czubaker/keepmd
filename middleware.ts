import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server" // Fixed import path

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient()

  // Handle auth callback
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url))
      }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect authenticated routes
  if (!user && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && ["/login", "/signup", "/forgot-password"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
