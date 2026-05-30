import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaign_id');

  if (!campaignId) {
    return NextResponse.json({ error: 'campaign_id required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, name, objective, status, meta_campaign_id')
    .eq('id', campaignId)
    .eq('user_id', user.id)
    .single();

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  if (!campaign.meta_campaign_id) {
    return NextResponse.json({
      campaign,
      adsets: [],
      message: 'Campaign not yet synced to Meta. Publish a creative to create the ad structure.',
    });
  }

  const token = process.env.META_SANDBOX_TOKEN;
  const accountId = process.env.META_SANDBOX_ACCOUNT_ID;

  if (!token || !accountId) {
    return NextResponse.json({ error: 'Sandbox credentials not configured' }, { status: 500 });
  }

  try {
    // Fetch ad sets for this campaign
    const adsetsRes = await fetch(
      `https://graph.facebook.com/v19.0/${campaign.meta_campaign_id}/adsets?fields=id,name,status,daily_budget,optimization_goal,targeting&access_token=${token}`
    );
    const adsetsData = await adsetsRes.json();

    if (adsetsData.error) {
      return NextResponse.json({ campaign, adsets: [], error: adsetsData.error.message });
    }

    const adsets = await Promise.all(
      (adsetsData.data ?? []).map(async (adset: any) => {
        const adsRes = await fetch(
          `https://graph.facebook.com/v19.0/${adset.id}/ads?fields=id,name,status,creative{id,name,thumbnail_url}&access_token=${token}`
        );
        const adsData = await adsRes.json();
        return { ...adset, ads: adsData.data ?? [] };
      })
    );

    return NextResponse.json({ campaign, adsets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
