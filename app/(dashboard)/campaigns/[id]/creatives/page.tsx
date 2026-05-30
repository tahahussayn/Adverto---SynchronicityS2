import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
    <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
      <CreativesClient campaignId={id} />
    </div>
  );
}
