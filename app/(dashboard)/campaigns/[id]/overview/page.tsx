import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CampaignOverviewClient from "@/components/CampaignOverviewClient";

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth");

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) return redirect("/campaigns");

  // Fetch metrics for this single campaign
  const { data: metricsData } = await supabase
    .from("performance_metrics")
    .select("spend, roas, cpa, ctr, conversions")
    .eq("campaign_id", id);
    
  let aggregatedMetrics = { spend: 0, roas: 0, cpa: 0, ctr: 0, conversions: 0 };
  if (metricsData && metricsData.length > 0) {
    const total = metricsData.reduce((acc, m) => {
      return {
        spend: acc.spend + (m.spend || 0),
        roas: acc.roas + (m.roas || 0),
        cpa: acc.cpa + (m.cpa || 0),
        ctr: acc.ctr + (m.ctr || 0),
        conversions: acc.conversions + (m.conversions || 0),
      };
    }, { spend: 0, roas: 0, cpa: 0, ctr: 0, conversions: 0 });
    
    aggregatedMetrics = {
      spend: total.spend,
      roas: total.roas / metricsData.length,
      cpa: total.cpa / metricsData.length,
      ctr: total.ctr / metricsData.length,
      conversions: total.conversions,
    };
  }

  return (
    <div className="flex-1 flex flex-col h-full relative z-10 w-full">
      <CampaignOverviewClient campaign={campaign} metrics={aggregatedMetrics} />
    </div>
  );
}
