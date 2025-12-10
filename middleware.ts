import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

export async function middleware(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase env vars missing. Skipping middleware.")
    return NextResponse.next()
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const token = req.cookies.get("sb-access-token")?.value
  if (!token) return NextResponse.next()

  const { data: user, error } = await supabase.auth.getUser(token)
  if (error || !user) return NextResponse.next()

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/articles/:path*"]
}
