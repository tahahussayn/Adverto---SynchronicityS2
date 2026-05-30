import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { creativeId } = await request.json();
    if (!creativeId) {
      return NextResponse.json({ error: 'Creative ID required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: creative } = await supabase
      .from('creatives')
      .select('id, campaign_id, campaigns(user_id)')
      .eq('id', creativeId)
      .single();

    if (!creative || (creative.campaigns as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Creative not found or unauthorized' }, { status: 404 });
    }

    // Update status to publishing
    await supabase.from('creatives').update({ status: 'publishing' }).eq('id', creativeId);

    // Fire webhook to n8n
    const n8nUrl = process.env.N8N_PUBLISH_WEBHOOK_URL;
    if (n8nUrl) {
      // Fire and forget
      fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-adverto-secret': process.env.ADVERTO_INTERNAL_SECRET || 'adverto-secret-xyz'
        },
        body: JSON.stringify({ creative_id: creativeId })
      }).catch(e => console.error('Failed to ping n8n publish webhook:', e));
    }

    return NextResponse.json({ success: true, message: 'Publishing initiated' });
  } catch (error: any) {
    console.error('Publish API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
