import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, request.url))
    }
    
    // Redirect with the exact error message from Supabase
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(error.message)}`, request.url))
  }

  // If token_hash or type is missing (e.g. old email template using hash fragments)
  return NextResponse.redirect(new URL('/auth?error=missing_token_or_type', request.url))
}
