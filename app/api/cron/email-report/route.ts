import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // Protect cron route from unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();

  try {
    // In production, this would query active users with `email_notifications: true`
    // and aggregate their last 24h of optimization jobs.
    const { data: users } = await supabase.from('users').select('email, id');
    
    if (!users) return NextResponse.json({ success: true, sent: 0 });

    let sentCount = 0;

    for (const user of users) {
      // Fetch optimization metrics for the user's campaigns
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, name')
        .eq('user_id', user.id);

      if (!campaigns || campaigns.length === 0) continue;

      // Mock sending email via Resend/SendGrid
      console.log(`[Email Cron] Sending Daily Report to ${user.email}`);
      console.log(`[Email Cron] Subject: ⚡ Adverto: 24h Optimization Summary`);
      console.log(`[Email Cron] Body: Evaluated ${campaigns.length} campaigns. 3 ads paused to save budget. 1 winner scaled.`);
      
      sentCount++;
    }

    return NextResponse.json({ success: true, sent: sentCount });

  } catch (error: any) {
    console.error('Cron Email Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
