"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Target, MousePointer2, Zap, RefreshCw, Check, ArrowLeft, ArrowRight, Bell, HelpCircle } from "lucide-react";

export default function CampaignOverviewClient({ campaign, metrics }: { campaign: any, metrics: any }) {
  const [optEnabled, setOptEnabled] = useState(campaign.status === "optimizing");
  const [isTogglingOpt, setIsTogglingOpt] = useState(false);
  const [brief, setBrief] = useState<string>(campaign.brief ?? "");
  const [isSavingBrief, setIsSavingBrief] = useState(false);
  const [briefSaved, setBriefSaved] = useState(false);
  const [adStructure, setAdStructure] = useState<any>(null);
  const [structureLoading, setStructureLoading] = useState(false);

  const thresholds = campaign.budget_thresholds ?? { max_cpa: 15, min_roas: 2.5, min_ctr: 0.008 };

  const handleOptToggle = async () => {
    const next = !optEnabled;
    setOptEnabled(next);
    setIsTogglingOpt(true);
    try {
      await fetch("/api/optimization/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaign.id, enabled: next }),
      });
    } catch {
      setOptEnabled(!next);
    } finally {
      setIsTogglingOpt(false);
    }
  };

  const fetchAdStructure = async () => {
    setStructureLoading(true);
    try {
      const res = await fetch(`/api/meta/campaign-structure?campaign_id=${campaign.id}`);
      const data = await res.json();
      setAdStructure(data);
    } finally {
      setStructureLoading(false);
    }
  };

  const saveBrief = async () => {
    setIsSavingBrief(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("campaigns").update({ brief }).eq("id", campaign.id);
      setBriefSaved(true);
      setTimeout(() => setBriefSaved(false), 2000);
    } finally {
      setIsSavingBrief(false);
    }
  };

  useEffect(() => { fetchAdStructure(); }, []);

  const totalSpend = metrics?.spend > 0 ? `$${metrics.spend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "—";
  const avgRoas = metrics?.roas > 0 ? `${metrics.roas.toFixed(1)}x` : "—";
  const avgCpa = metrics?.cpa > 0 ? `$${metrics.cpa.toFixed(2)}` : "—";
  const avgCtr = metrics?.ctr > 0 ? `${(metrics.ctr * 100).toFixed(2)}%` : "—";

  return (
    <>
      {/* TopNavBar (Shared Component Context) */}
      <header className="bg-background/80 backdrop-blur-xl text-primary font-body-md text-body-md docked full-width top-0 border-b border-outline-variant flat no shadows flex justify-between items-center w-full px-md h-16 sticky z-50">
        {/* Breadcrumbs / Context */}
        <div className="flex items-center gap-sm text-on-surface-variant text-sm">
          <Link href="/campaigns" className="material-symbols-outlined text-[18px] cursor-pointer active:scale-95 hover:text-primary transition-colors duration-200">arrow_back</Link>
          <Link href="/campaigns" className="cursor-pointer hover:text-on-surface transition-colors">Campaigns</Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-medium">{campaign.name}</span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined cursor-pointer active:scale-95 text-on-surface-variant hover:text-primary transition-colors duration-200">notifications</span>
            <span className="material-symbols-outlined cursor-pointer active:scale-95 text-on-surface-variant hover:text-primary transition-colors duration-200">help</span>
          </div>
          <Link href="/campaigns/new" className="bg-on-surface text-primary-container px-4 py-2 rounded font-label-sm text-label-sm uppercase hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all cursor-pointer active:scale-95">
            Create Campaign
          </Link>
        </div>
      </header>

      {/* Split Pane Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Inner Left Sidebar (Settings/Metrics) */}
        <aside className="w-[380px] bg-surface-container-lowest/50 glass-panel border-r border-outline-variant overflow-y-auto flex flex-col">
          {/* Campaign Header */}
          <div className="p-md border-b border-outline-variant/50">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Campaign</div>
            <h2 className="font-headline-lg text-[28px] leading-tight text-on-surface mb-3 tracking-tight">{campaign.name}</h2>
            <div className="flex items-center gap-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{campaign.objective ?? "CONVERSIONS"}</span>
              <div className="bg-[#163321] border border-[#214E34] text-[#4ADE80] font-label-sm text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]"></span>
                {optEnabled ? "Optimizing" : "Active"}
              </div>
            </div>
          </div>
          
          {/* Metrics Grid */}
          <div className="p-md border-b border-outline-variant/50 grid grid-cols-2 gap-sm">
            <div className="bg-surface border border-outline-variant rounded p-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-[10px] uppercase mb-1">
                <span className="material-symbols-outlined text-[14px]">payments</span> Spend
              </div>
              <div className="font-headline-lg text-[20px] text-on-surface">{totalSpend}</div>
            </div>
            <div className="bg-surface border border-outline-variant rounded p-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8A2BE2]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-[10px] uppercase mb-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> ROAS
              </div>
              <div className="font-headline-lg text-[20px] text-on-surface">{avgRoas}</div>
            </div>
            <div className="bg-surface border border-outline-variant rounded p-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-[10px] uppercase mb-1">
                <span className="material-symbols-outlined text-[14px]">track_changes</span> CPA
              </div>
              <div className="font-headline-lg text-[20px] text-on-surface">{avgCpa}</div>
            </div>
            <div className="bg-surface border border-outline-variant rounded p-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-[10px] uppercase mb-1">
                <span className="material-symbols-outlined text-[14px]">ads_click</span> CTR
              </div>
              <div className="font-headline-lg text-[20px] text-on-surface">{avgCtr}</div>
            </div>
          </div>
          
          {/* Autopilot Section */}
          <div className="p-md border-b border-outline-variant/50 flex justify-between items-center">
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Autopilot</div>
              <div className="text-sm text-on-surface">24h optimization</div>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={optEnabled} onChange={handleOptToggle} disabled={isTogglingOpt} />
              <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all border border-outline-variant peer-checked:bg-primary/20 peer-checked:border-primary"></div>
            </label>
          </div>
          
          {/* Thresholds Section */}
          <div className="p-md border-b border-outline-variant/50 flex flex-col gap-sm">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Thresholds</div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-[10px] text-on-surface">Max CPA ($)</label>
              <input type="number" defaultValue={thresholds.max_cpa} className="bg-surface border border-outline-variant rounded p-2 text-sm text-on-surface font-label-sm focus:border-on-surface focus:ring-0 transition-colors w-full"/>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-[10px] text-on-surface">Min ROAS (x)</label>
              <input type="number" defaultValue={thresholds.min_roas} className="bg-surface border border-outline-variant rounded p-2 text-sm text-on-surface font-label-sm focus:border-on-surface focus:ring-0 transition-colors w-full"/>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-[10px] text-on-surface">Min CTR (%)</label>
              <input type="number" defaultValue={thresholds.min_ctr} className="bg-surface border border-outline-variant rounded p-2 text-sm text-on-surface font-label-sm focus:border-on-surface focus:ring-0 transition-colors w-full"/>
            </div>
          </div>
          
          {/* AI Brief */}
          <div className="p-md flex flex-col gap-sm flex-1">
            <div className="flex justify-between items-center">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">AI Brief</div>
              <button onClick={saveBrief} disabled={isSavingBrief} className="text-on-surface hover:text-primary transition-colors text-sm">
                {briefSaved ? "Saved" : isSavingBrief ? "Saving..." : "Save"}
              </button>
            </div>
            <textarea 
              value={brief}
              onChange={e => setBrief(e.target.value)}
              className="bg-surface border border-outline-variant rounded p-3 text-sm text-on-surface focus:border-on-surface focus:ring-0 transition-colors w-full flex-1 resize-none font-body-md" 
              placeholder="Describe your product, target audience, and key value propositions..."
            />
          </div>
        </aside>
        
        {/* Main Canvas (Ad Structure) */}
        <section className="flex-1 flex flex-col relative bg-transparent p-md overflow-y-auto">
          <div className="flex justify-between items-center mb-md pb-sm border-b border-outline-variant/30">
            <h3 className="font-headline-lg text-[20px] text-on-surface">Ad Structure</h3>
            <button onClick={fetchAdStructure} disabled={structureLoading} className="flex items-center gap-xs text-sm text-on-surface-variant hover:text-on-surface transition-colors bg-surface-container-high px-3 py-1.5 rounded border border-outline-variant">
              <span className={`material-symbols-outlined text-[16px] ${structureLoading ? 'animate-spin' : ''}`}>refresh</span>
              Refresh from Meta
            </button>
          </div>
          
          <div className="flex flex-col gap-xs">
            <div className="bg-surface border border-outline-variant rounded p-3 flex justify-between items-center group hover:border-outline transition-colors">
              <div className="flex items-center gap-sm">
                <span className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                <span className="font-medium text-on-surface">{campaign.name}</span>
              </div>
              <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider bg-surface-container-high px-2 py-1 rounded">
                  {campaign.objective ?? "CONVERSIONS"}
              </div>
            </div>
            
            {structureLoading && (
              <div className="ml-6 mt-4 p-md rounded flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[32px] text-outline-variant mb-2 opacity-50 animate-spin">refresh</span>
                <p className="text-on-surface-variant text-sm">Loading ad structure...</p>
              </div>
            )}
            
            {!structureLoading && (!adStructure || !adStructure.adsets || adStructure.adsets.length === 0) && (
              <div className="ml-6 mt-4 p-md border border-dashed border-outline-variant/50 rounded flex flex-col items-center justify-center text-center bg-surface-container-lowest/30 glass-panel h-[200px]">
                <span className="material-symbols-outlined text-[32px] text-outline-variant mb-2 opacity-50">account_tree</span>
                <p className="text-on-surface-variant text-sm">{adStructure?.message || "No ad sets found in this campaign."}</p>
                <button onClick={fetchAdStructure} className="mt-4 text-sm text-primary border border-primary/30 hover:bg-primary/5 px-4 py-1.5 rounded transition-colors">
                    Sync Hierarchy
                </button>
              </div>
            )}
            
            {!structureLoading && adStructure?.adsets?.map((adset: any) => (
              <div key={adset.id} className="ml-6 mt-2 border border-outline-variant/50 rounded overflow-hidden">
                <div className="w-full flex justify-between items-center gap-3 px-4 py-3 bg-surface-container-lowest hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-sm font-semibold text-on-surface text-left flex-1">{adset.name}</span>
                  </div>
                  <div className="flex items-center gap-md">
                    {adset.daily_budget && (
                      <span className="text-xs text-on-surface-variant font-label-sm">${(adset.daily_budget / 100).toFixed(2)}/day</span>
                    )}
                    <span className="text-[10px] font-bold text-success uppercase">{adset.status}</span>
                  </div>
                </div>
                <div className="divide-y divide-outline-variant/30 bg-background">
                  {(adset.ads ?? []).map((ad: any) => (
                    <div key={ad.id} className="flex items-center justify-between px-8 py-3">
                      <div className="flex items-center gap-3">
                        {ad.creative?.thumbnail_url && (
                          <img src={ad.creative.thumbnail_url} alt="" className="w-8 h-8 rounded border border-outline-variant object-cover shrink-0" />
                        )}
                        <span className="text-xs text-on-surface-variant flex-1 truncate">{ad.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${ad.status === "ACTIVE" ? "text-success" : "text-outline-variant"}`}>
                        {ad.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-md right-md">
            <div className="w-12 h-12 rounded-full bg-surface border border-outline-variant flex items-center justify-center cursor-pointer hover:border-primary transition-all group shadow-lg">
              <div className="w-3 h-3 rounded-full bg-[#00C3FF] group-hover:shadow-[0_0_15px_#00C3FF] transition-all"></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
