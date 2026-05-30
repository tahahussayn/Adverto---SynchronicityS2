import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CampaignTabNav from "@/components/CampaignTabNav";
import CampaignSideNav from "@/components/CampaignSideNav";
import CreativesClient from "@/components/CreativesClient";

export default async function CreativesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth");

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!campaign) return redirect("/campaigns");

  return (
    <div className="h-screen flex flex-col bg-base-100 overflow-hidden">
      <CampaignTabNav campaignId={id} campaignName={campaign.name} />
      <div className="flex flex-1 overflow-hidden">
        <CampaignSideNav campaignId={id} />
        <CreativesClient campaignId={id} />
      </div>
    </div>
  );
}
