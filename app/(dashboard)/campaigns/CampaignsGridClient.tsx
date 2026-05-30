"use client";

import { useState } from "react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  active: "text-emerald-400",
  optimizing: "text-indigo-400",
  paused: "text-on-surface-variant",
  draft: "text-on-surface-variant",
};

type CampaignStat = { spend: number; roas: number; cpa: number; ctr: number; conversions: number };

export default function CampaignsGridClient({
  initialCampaigns,
  userEmail,
  campaignStats = {},
}: {
  initialCampaigns: any[];
  userEmail: string | undefined;
  campaignStats?: Record<string, CampaignStat>;
}) {
  const [filter, setFilter] = useState("ALL");

  const approvalCount = initialCampaigns.reduce((acc, c) => {
    return acc + (c.creatives?.filter((cr: any) => cr.status === "pending_approval").length || 0);
  }, 0);

  const filters = ["ALL", "ACTIVE", "OPTIMIZING", "PAUSED"];

  const filteredCampaigns = initialCampaigns.filter(
    (c) => filter === "ALL" || (c.status ?? "active").toUpperCase() === filter
  );

  const allStats = Object.values(campaignStats);
  const totalSpend = allStats.reduce((s, m) => s + m.spend, 0);
  const avgRoas = allStats.length ? allStats.reduce((s, m) => s + m.roas, 0) / allStats.length : 0;
  const activeCount = initialCampaigns.filter((c) => (c.status ?? "active") === "active").length;

  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-lg py-lg">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-sm mb-lg">
        <div>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-1">Campaigns</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{initialCampaigns.length} campaigns total</p>
        </div>
        <Link href="/campaigns/new" className="bg-on-surface text-background font-label-sm text-label-sm px-md py-sm rounded-DEFAULT flex items-center justify-center gap-xs hover:bg-surface-tint transition-all duration-300 group hover:shadow-[0_0_15px_rgba(229,226,225,0.3)]">
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-90 duration-300">add</span>
          New Campaign
        </Link>
      </header>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm mb-xl">
        {/* Card 1 */}
        <div className="glass-panel rounded-lg p-md relative overflow-hidden group glow-hover transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary text-[18px]">attach_money</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant">TOTAL SPEND</h3>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {totalSpend > 0 ? `$${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "—"}
          </div>
        </div>
        {/* Card 2 */}
        <div className="glass-panel rounded-lg p-md relative overflow-hidden group glow-hover transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/50 to-transparent"></div>
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant">AVG ROAS</h3>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {avgRoas > 0 ? `${avgRoas.toFixed(1)}x` : "—"}
          </div>
        </div>
        {/* Card 3 */}
        <div className="glass-panel rounded-lg p-md relative overflow-hidden group glow-hover transition-all duration-300">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">bolt</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant">ACTIVE CAMPAIGNS</h3>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {activeCount}
          </div>
        </div>
        {/* Card 4 */}
        <div className="glass-panel rounded-lg p-md relative overflow-hidden group glow-hover transition-all duration-300">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant">PENDING APPROVAL</h3>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {approvalCount}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-outline-variant mb-xl">
        <div className="flex gap-md overflow-x-auto pb-sm no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-label-sm text-label-sm pb-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${filter === f ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Campaign Grid or Empty State */}
      {filteredCampaigns.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
          {filteredCampaigns.map((campaign) => {
            const status = campaign.status ?? "active";
            const totalCreatives = campaign.creatives?.length ?? 0;
            const publishedCreatives = campaign.creatives?.filter((c: any) => c.status === "published").length ?? 0;
            const stats = campaignStats[campaign.id];

            return (
              <Link
                key={campaign.id} href={`/campaigns/${campaign.id}/overview`}
                className="glass-panel rounded-lg p-md relative overflow-hidden group glow-hover transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-headline-lg text-lg text-on-surface leading-tight tracking-tight">{campaign.name}</h3>
                  <span className={`font-label-sm text-label-sm uppercase tracking-wider ${STATUS_STYLES[status] ?? "text-on-surface-variant"}`}>
                    {status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[10px] text-on-surface-variant border border-outline-variant px-2 py-1 rounded-sm uppercase">
                    {campaign.objective ?? "CONVERSIONS"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-outline-variant/50">
                  <div>
                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">Creatives</div>
                    <div className="font-body-md text-sm text-on-surface font-bold">{totalCreatives}</div>
                  </div>
                  <div>
                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">Published</div>
                    <div className="font-body-md text-sm text-emerald-400 font-bold">{publishedCreatives}</div>
                  </div>
                  <div>
                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase mb-1">CTR</div>
                    <div className="font-body-md text-sm text-on-surface font-bold">
                      {stats ? `${(stats.ctr * 100).toFixed(2)}%` : "—"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors mt-auto pt-2">
                  <span className="uppercase tracking-widest">Open Campaign</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-xl">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-md border border-outline-variant">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">grid_view</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">No campaigns found</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Try adjusting your filters or create a new campaign.</p>
          <Link href="/campaigns/new" className="text-on-surface hover:text-primary font-label-sm text-label-sm flex items-center gap-xs transition-colors duration-300 border border-outline-variant px-md py-sm rounded-DEFAULT hover:border-primary/50 hover:bg-primary/5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Campaign
          </Link>
        </section>
      )}
    </div>
  );
}
