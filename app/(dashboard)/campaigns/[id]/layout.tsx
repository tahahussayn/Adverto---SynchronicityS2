import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CampaignTopNav from "@/components/CampaignTopNav";

export default async function CampaignLayout({ params, children }: { params: Promise<{ id: string }>, children: React.ReactNode }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: campaign } = await supabase.from("campaigns").select("name").eq("id", id).single();
  
  if (!campaign) return redirect("/campaigns");

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <CampaignTopNav campaignId={id} campaignName={campaign.name} />
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
