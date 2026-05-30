import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { campaign_id, enabled } = await request.json();

  if (!campaign_id || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'campaign_id and enabled (boolean) required' }, { status: 400 });
  }

  const newStatus = enabled ? 'optimizing' : 'active';

  const { error } = await supabase
    .from('campaigns')
    .update({ status: newStatus })
    .eq('id', campaign_id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (enabled) {
    const webhookUrl = process.env.N8N_OPTIMIZATION_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-adverto-secret': process.env.N8N_WEBHOOK_SECRET ?? 'adverto-secret-xyz',
          },
          body: JSON.stringify({ campaign_id }),
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        // Fire-and-forget — don't fail the request if n8n is unreachable
      }
    }
  }

  return NextResponse.json({ status: newStatus });
}
