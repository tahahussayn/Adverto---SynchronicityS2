import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/settings?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Exchange code for short-lived token
    const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/meta/oauth&client_secret=${process.env.META_APP_SECRET}&code=${code}`);
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) throw new Error(tokenData.error.message);

    // 2. Exchange short-lived token for long-lived token
    const longTokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${tokenData.access_token}`);
    const longTokenData = await longTokenRes.json();

    if (longTokenData.error) throw new Error(longTokenData.error.message);

    // 3. Store long-lived token in Supabase (Ideally using Supabase Vault via RPC)
    // For MVP, we'll store it in the user's meta_tokens JSONB column
    await supabase.from('users').update({
      meta_tokens: {
        access_token: longTokenData.access_token,
        expires_at: Date.now() + (longTokenData.expires_in * 1000)
      }
    }).eq('id', user.id);

    return NextResponse.redirect(new URL('/settings?meta=success', request.url));

  } catch (err: any) {
    console.error('Meta OAuth Error:', err);
    return NextResponse.redirect(new URL(`/settings?error=oauth_failed`, request.url));
  }
}
