import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return logout(request)
}

export async function POST(request: Request) {
  return logout(request)
}

async function logout(request: Request) {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`, {
    status: 303,
  })
}
