"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type Creative = {
  id: string;
  campaign_id: string;
  status: string;
  format_type: string;
  headline: string;
  body_copy: string;
  cta_text: string;
  image_url: string;
  video_url: string;
  thumbnail_url: string;
  meta_ad_id?: string;
  performance_score?: number;
  approved_at?: string;
  created_at?: string;
};

const COLUMNS =
  "id, campaign_id, status, format_type, headline, body_copy, cta_text, image_url, video_url, thumbnail_url, meta_ad_id, performance_score, approved_at, created_at";

export function useCreatives(campaignId?: string) {
  const [creatives, setCreatives] = useState<Creative[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | undefined;
    let cancelled = false;

    const fetchCreatives = async () => {
      let query = supabase.from("creatives").select(COLUMNS).order("created_at", { ascending: false });
      if (campaignId) query = query.eq("campaign_id", campaignId);
      const { data, error } = await query;
      if (!cancelled && data) setCreatives(data as unknown as Creative[]);
      if (error) console.error("Error fetching creatives:", error);
    };

    (async () => {
      // Authenticate the realtime socket so RLS-filtered postgres_changes are delivered
      const { data: { session } } = await supabase.auth.getSession();
      if (session) supabase.realtime.setAuth(session.access_token);

      await fetchCreatives();
      if (cancelled) return;

      channel = supabase
        .channel(`creatives-${campaignId ?? "all"}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "creatives",
            ...(campaignId ? { filter: `campaign_id=eq.${campaignId}` } : {}),
          },
          (payload: RealtimePostgresChangesPayload<Creative>) => {
            if (payload.eventType === "INSERT") {
              setCreatives((prev) =>
                prev.some((c) => c.id === (payload.new as Creative).id)
                  ? prev
                  : [payload.new as Creative, ...prev]
              );
            } else if (payload.eventType === "UPDATE") {
              setCreatives((prev) =>
                prev.map((c) => (c.id === (payload.new as Creative).id ? (payload.new as Creative) : c))
              );
            } else if (payload.eventType === "DELETE") {
              setCreatives((prev) => prev.filter((c) => c.id !== (payload.old as Creative).id));
            }
          }
        )
        .subscribe((status: string) => console.log(`creatives-${campaignId ?? "all"} channel:`, status));
    })();

    // Keep the realtime token fresh across auth changes
    const { data: authSub } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session) supabase.realtime.setAuth(session.access_token);
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      authSub.subscription.unsubscribe();
    };
  }, [campaignId]);

  return creatives;
}
