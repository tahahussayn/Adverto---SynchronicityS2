import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, objective, budget_thresholds, brief } = await request.json();

  if (!name || !objective) {
    return NextResponse.json({ error: 'name and objective are required' }, { status: 400 });
  }

  const token = process.env.META_SANDBOX_TOKEN;
  const accountId = process.env.META_SANDBOX_ACCOUNT_ID;

  if (!token || !accountId) {
    return NextResponse.json({ error: 'Sandbox credentials not configured' }, { status: 500 });
  }

  // Map our objective labels to Meta API values
  const objectiveMap: Record<string, string> = {
    CONVERSIONS: 'OUTCOME_SALES',
    TRAFFIC: 'OUTCOME_TRAFFIC',
    LEADS: 'OUTCOME_LEADS',
    AWARENESS: 'OUTCOME_AWARENESS',
  };
  const metaObjective = objectiveMap[objective] ?? 'OUTCOME_SALES';

  // Create campaign in Meta
  const metaRes = await fetch(
    `https://graph.facebook.com/v19.0/act_${accountId}/campaigns`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        objective: metaObjective,
        status: 'PAUSED',
        special_ad_categories: [],
        is_adset_budget_sharing_enabled: false,
        access_token: token,
      }),
    }
  );

  const metaData = await metaRes.json();

  if (metaData.error) {
    console.error('Meta create campaign error:', metaData.error);
    // Still create the local campaign — Meta sandbox may reject for app review reasons
    // but we don't want to block the hackathon demo
  }

  const metaCampaignId = metaData.id ?? null;

  // Ensure user row exists (foreign key requirement)
  await supabase.from('users').upsert(
    { id: user.id, email: user.email ?? '' },
    { onConflict: 'id' }
  );

  // Insert into Supabase
  const { data: campaign, error } = await supabase.from('campaigns').insert({
    user_id: user.id,
    name,
    objective,
    status: 'active',
    meta_campaign_id: metaCampaignId,
    brief: brief ?? null,
    budget_thresholds: budget_thresholds ?? {
      max_cpa: 15.00,
      min_roas: 2.5,
      min_ctr: 0.008,
      min_spend_before_eval: 50.00,
    },
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If brief provided, fire n8n to kick off initial creative generation
  if (brief && process.env.N8N_WEBHOOK_URL) {
    fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaign.id,
        campaign_name: name,
        campaign_objective: objective,
        campaign_brief: brief,
        user_prompt: brief,
        format_type: 'Static',
        aspect_ratio: '1:1',
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ campaign });
}
