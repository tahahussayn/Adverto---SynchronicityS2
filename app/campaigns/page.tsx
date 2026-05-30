import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CampaignsGridClient from "./CampaignsGridClient";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth");

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select('*, creatives(id, status)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const safeCampaigns = campaigns || [];

  // Fetch performance metrics for all campaigns
  const { data: metrics } = safeCampaigns.length
    ? await supabase
        .from("performance_metrics")
        .select("campaign_id, spend, roas, cpa, ctr, conversions")
        .in("campaign_id", safeCampaigns.map((c) => c.id))
    : { data: [] };

  // Aggregate per campaign
  type StatAcc = { spend: number; roas: number; cpa: number; ctr: number; conversions: number; count: number };
  const acc: Record<string, StatAcc> = {};
  for (const m of metrics ?? []) {
    if (!acc[m.campaign_id]) acc[m.campaign_id] = { spend: 0, roas: 0, cpa: 0, ctr: 0, conversions: 0, count: 0 };
    acc[m.campaign_id].spend += m.spend ?? 0;
    acc[m.campaign_id].roas += m.roas ?? 0;
    acc[m.campaign_id].cpa += m.cpa ?? 0;
    acc[m.campaign_id].ctr += m.ctr ?? 0;
    acc[m.campaign_id].conversions += m.conversions ?? 0;
    acc[m.campaign_id].count += 1;
  }
  const campaignStats: Record<string, { spend: number; roas: number; cpa: number; ctr: number; conversions: number }> = {};
  for (const [id, s] of Object.entries(acc)) {
    const n = s.count || 1;
    campaignStats[id] = { spend: s.spend, roas: s.roas / n, cpa: s.cpa / n, ctr: s.ctr / n, conversions: s.conversions };
  }

  return <CampaignsGridClient initialCampaigns={safeCampaigns} userEmail={user.email} campaignStats={campaignStats} />;
}
