import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GenerateClient from "@/components/GenerateClient";

export default async function GeneratePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth");

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, objective, target_audience, brief")
    .eq("id", id)
    .single();

  if (!campaign) return redirect("/campaigns");

  const campaignDesc = [campaign.brief, campaign.objective, campaign.target_audience]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <GenerateClient
        campaignId={id}
        campaignName={campaign.name}
        campaignDesc={campaignDesc}
        brief={campaign.brief ?? ""}
      />
    </div>
  );
}
