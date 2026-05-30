import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ error: "N8N_WEBHOOK_URL not configured" }, { status: 500 });

  // Insert creative immediately with status: generating
  const { data: creative, error } = await supabase
    .from("creatives")
    .insert({
      campaign_id: body.campaign_id,
      status: "generating",
      format_type: body.format_type,
    })
    .select("id")
    .single();

  if (error || !creative) {
    return NextResponse.json({ error: "Failed to create creative record" }, { status: 500 });
  }

  // Fire n8n with creative_id so it can update the row when done
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, creative_id: creative.id }),
  }).catch(() => {});

  return NextResponse.json({ ok: true, creative_id: creative.id });
}
