"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, DollarSign, TrendingUp, Zap, Clock, LayoutGrid, ArrowRight, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500 text-white border-0",
  optimizing: "bg-indigo-500 text-white border-0",
  paused: "bg-base-300 text-base-content/60 border-0",
  draft: "bg-base-300 text-base-content/60 border-0",
};

const OBJECTIVE_STYLES: Record<string, string> = {
  CONVERSIONS: "badge-primary",
  TRAFFIC: "badge-accent",
  LEADS: "badge-secondary",
  AWARENESS: "badge-neutral",
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

  // Aggregate global stats across all campaigns
  const allStats = Object.values(campaignStats);
  const totalSpend = allStats.reduce((s, m) => s + m.spend, 0);
  const avgRoas = allStats.length ? allStats.reduce((s, m) => s + m.roas, 0) / allStats.length : 0;
  const activeCount = initialCampaigns.filter((c) => (c.status ?? "active") === "active").length;

  return (
    <div className="min-h-screen bg-base-100 bg-dot-grid">
      {/* Top Nav */}
      <nav className="h-14 bg-base-200 border-b border-base-300 flex items-center justify-between px-6 sticky top-0 z-10">
        <span className="font-display font-bold text-lg tracking-tight text-base-content">Averto</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
            {userEmail?.charAt(0).toUpperCase() ?? "U"}
          </div>
        </div>
      </nav>

      {/* Approval Banner */}
      {approvalCount > 0 && (
        <div className="w-full bg-warning/10 border-b border-warning/20 px-6 py-2.5 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-warning" />
          <span className="text-sm font-bold text-warning">{approvalCount} creatives need your approval</span>
          <ArrowRight className="w-3.5 h-3.5 text-warning" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Campaigns</h1>
            <p className="text-base-content/50 text-sm mt-1">{initialCampaigns.length} campaign{initialCampaigns.length !== 1 ? "s" : ""} total</p>
          </div>
          <Link href="/campaigns/new" className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Spend", value: totalSpend > 0 ? `$${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "—", icon: DollarSign, color: "text-primary" },
            { label: "Avg ROAS", value: avgRoas > 0 ? `${avgRoas.toFixed(1)}x` : "—", icon: TrendingUp, color: "text-success" },
            { label: "Active Campaigns", value: activeCount.toString(), icon: Zap, color: "text-warning" },
            { label: "Pending Approval", value: approvalCount.toString(), icon: Clock, color: "text-error" },
          ].map((stat) => (
            <div key={stat.label} className="bg-base-200 rounded-2xl border border-base-300 p-5">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-base-content">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm rounded-full ${filter === f ? "btn-primary" : "btn-ghost"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Campaign Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCampaigns.map((campaign) => {
              const status = campaign.status ?? "active";
              const totalCreatives = campaign.creatives?.length ?? 0;
              const publishedCreatives = campaign.creatives?.filter((c: any) => c.status === "published").length ?? 0;
              const stats = campaignStats[campaign.id];

              return (
                <Link
                  key={campaign.id} href={`/campaigns/${campaign.id}/overview`}
                  className="bg-base-200 rounded-2xl border border-base-300 p-5 flex flex-col gap-4 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-base-content text-base leading-tight">{campaign.name}</h3>
                    <span className={`badge badge-sm shrink-0 ${STATUS_STYLES[status] ?? "bg-base-300 text-base-content/60 border-0"}`}>
                      {status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`badge badge-sm badge-outline ${OBJECTIVE_STYLES[campaign.objective] ?? "badge-neutral"}`}>
                      {campaign.objective ?? "CONVERSIONS"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-base-300">
                    <div>
                      <div className="text-[10px] text-base-content/40 font-bold uppercase mb-0.5">Creatives</div>
                      <div className="font-bold text-sm text-base-content">{totalCreatives}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-base-content/40 font-bold uppercase mb-0.5">Published</div>
                      <div className="font-bold text-sm text-emerald-500">{publishedCreatives}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-base-content/40 font-bold uppercase mb-0.5">CTR</div>
                      <div className="font-bold text-sm text-base-content">
                        {stats ? `${(stats.ctr * 100).toFixed(2)}%` : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-semibold text-base-content/50 group-hover:text-primary transition-colors">
                    <span>Open Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-base-300 flex items-center justify-center">
              <LayoutGrid className="w-8 h-8 text-base-content/30" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base-content text-lg">No campaigns found</h3>
              <p className="text-base-content/50 text-sm mt-1">Try adjusting your filters or create a new campaign.</p>
            </div>
            <Link href="/campaigns/new" className="btn btn-primary btn-sm gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
