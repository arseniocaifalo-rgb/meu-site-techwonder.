// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Variáveis server-side
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!

export async function middleware(req: NextRequest) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  const token = req.cookies.get("sb-access-token")?.value

  // Se não tiver token, é visitante: deixa ver artigos, bloqueia admin/dashboard
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/create-article")) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  // Se tiver token, verifica usuário no Supabase
  const { data: user, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    // Token inválido: trata como visitante
    if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/create-article")) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  // Usuário logado: permite acessar admin/dashboard
  return NextResponse.next()
}

// Páginas protegidas (admin, criação de artigos)
export const config = {
  matcher: ["/admin/:path*", "/create-article/:path*"]
}

