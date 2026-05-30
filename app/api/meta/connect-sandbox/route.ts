import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = process.env.META_SANDBOX_ACCOUNT_ID;
  const token = process.env.META_SANDBOX_TOKEN;

  if (!accountId || !token) {
    return NextResponse.json({ error: 'Sandbox credentials not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('users').update({
    meta_ad_account_id: `act_${accountId}`,
    meta_tokens: { access_token: token, expires_at: null }
  }).eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ account_id: `act_${accountId}` });
}
