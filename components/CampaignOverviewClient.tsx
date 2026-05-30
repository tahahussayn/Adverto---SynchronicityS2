"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Target, MousePointer2, Zap, ChevronRight, ChevronDown, RefreshCw, Check } from "lucide-react";

export default function CampaignOverviewClient({ campaign }: { campaign: any }) {
  const [optEnabled, setOptEnabled] = useState(campaign.status === "optimizing");
  const [isTogglingOpt, setIsTogglingOpt] = useState(false);
  const [brief, setBrief] = useState<string>(campaign.brief ?? "");
  const [isSavingBrief, setIsSavingBrief] = useState(false);
  const [briefSaved, setBriefSaved] = useState(false);
  const [adStructure, setAdStructure] = useState<any>(null);
  const [structureLoading, setStructureLoading] = useState(false);
  const [expandedAdsets, setExpandedAdsets] = useState<Record<string, boolean>>({});

  const thresholds = campaign.budget_thresholds ?? {};

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

  const toggleAdset = (id: string) =>
    setExpandedAdsets((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => { fetchAdStructure(); }, []);

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* Left: Settings panel */}
      <div className="w-72 shrink-0 border-r border-base-300 bg-base-200 flex flex-col overflow-y-auto">

        {/* Campaign identity */}
        <div className="px-5 py-5 border-b border-base-300">
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-2">Campaign</p>
          <h2 className="font-bold text-xl text-base-content leading-tight">{campaign.name}</h2>
          <div className="flex items-center gap-2 mt-3">
            <span className="badge badge-sm badge-outline badge-primary">{campaign.objective ?? "CONVERSIONS"}</span>
            <span className={`badge badge-sm border-0 ${optEnabled ? "bg-indigo-500 text-white" : "bg-emerald-500 text-white"}`}>
              {optEnabled ? "Optimizing" : "Active"}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 px-4 py-4 border-b border-base-300">
          {[
            { label: "Spend", value: "$2,450", icon: DollarSign },
            { label: "ROAS", value: "3.8x", icon: TrendingUp },
            { label: "CPA", value: "$12.40", icon: Target },
            { label: "CTR", value: "1.24%", icon: MousePointer2 },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-base-100 border border-base-300 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <kpi.icon className="w-3 h-3 text-base-content/30" />
                <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <div className="font-bold text-lg text-base-content">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Autopilot */}
        <div className="px-5 py-5 border-b border-base-300">
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-3">Autopilot</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-base-content">24h optimization</div>
              {optEnabled && (
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-primary">
                  <Zap className="w-3 h-3" />
                  Active
                </div>
              )}
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={optEnabled}
              onChange={handleOptToggle}
              disabled={isTogglingOpt}
            />
          </div>
        </div>

        {/* Thresholds */}
        <div className="px-5 py-5 border-b border-base-300">
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-4">Thresholds</p>
          <div className="space-y-4">
            {[
              { label: "Max CPA", suffix: "$", key: "max_cpa", default: "15.00" },
              { label: "Min ROAS", suffix: "×", key: "min_roas", default: "2.5" },
              { label: "Min CTR", suffix: "%", key: "min_ctr", default: "0.008" },
            ].map(({ label, suffix, key, default: def }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-base-content/60 mb-1.5">
                  {label} <span className="text-base-content/30">({suffix})</span>
                </label>
                <input
                  type="number"
                  defaultValue={thresholds[key] ?? def}
                  className="input input-sm input-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Brief */}
        <div className="px-5 py-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">AI Brief</p>
            <button
              onClick={saveBrief}
              disabled={isSavingBrief}
              className="btn btn-xs btn-ghost gap-1 text-base-content/50 hover:text-base-content"
            >
              {briefSaved ? (
                <><Check className="w-3 h-3 text-success" /><span className="text-success">Saved</span></>
              ) : isSavingBrief ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Save"
              )}
            </button>
          </div>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Describe your product, target audience, and key value propositions..."
            className="flex-1 textarea textarea-bordered text-xs leading-relaxed resize-none min-h-[120px]"
          />
        </div>
      </div>

      {/* Right: Ad Structure — full height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200 shrink-0">
          <h3 className="font-bold text-base-content">Ad Structure</h3>
          <button
            onClick={fetchAdStructure}
            disabled={structureLoading}
            className="btn btn-xs btn-ghost gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${structureLoading ? "animate-spin" : ""}`} />
            {structureLoading ? "Loading..." : "Refresh from Meta"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!adStructure && !structureLoading && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-base-content/30">
              <div className="w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold">No ad structure loaded</p>
              <p className="text-xs text-center max-w-xs">
                Click refresh to load your campaign's ad sets and ads from Meta.
              </p>
              <button onClick={fetchAdStructure} className="btn btn-sm btn-primary mt-2">
                Load Structure
              </button>
            </div>
          )}

          {structureLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}
            </div>
          )}

          {adStructure && (
            <div className="space-y-2">
              {/* Campaign row */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <span className="font-bold text-sm text-base-content flex-1">{campaign.name}</span>
                <span className="badge badge-xs badge-primary">{campaign.objective}</span>
              </div>

              {adStructure.message && (
                <p className="text-xs text-base-content/40 px-4 py-2">{adStructure.message}</p>
              )}

              {(adStructure.adsets ?? []).length === 0 && !adStructure.message && (
                <p className="text-xs text-base-content/40 px-4 py-3">No ad sets found in this campaign.</p>
              )}

              {(adStructure.adsets ?? []).map((adset: any) => (
                <div key={adset.id} className="rounded-xl border border-base-300 overflow-hidden">
                  <button
                    onClick={() => toggleAdset(adset.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-base-200 hover:bg-base-300 transition-colors"
                  >
                    {expandedAdsets[adset.id]
                      ? <ChevronDown className="w-4 h-4 text-base-content/30" />
                      : <ChevronRight className="w-4 h-4 text-base-content/30" />}
                    <span className="w-2 h-2 rounded-full bg-info shrink-0" />
                    <span className="text-sm font-semibold text-base-content text-left flex-1">{adset.name}</span>
                    {adset.daily_budget && (
                      <span className="text-xs text-base-content/40 font-mono">${(adset.daily_budget / 100).toFixed(2)}/day</span>
                    )}
                    <span className={`badge badge-xs ${adset.status === "ACTIVE" ? "badge-success" : "badge-neutral"}`}>
                      {adset.status}
                    </span>
                  </button>

                  {expandedAdsets[adset.id] && (
                    <div className="divide-y divide-base-300 bg-base-100">
                      {(adset.ads ?? []).length === 0 && (
                        <div className="px-10 py-3 text-xs text-base-content/30">No ads in this ad set</div>
                      )}
                      {(adset.ads ?? []).map((ad: any) => (
                        <div key={ad.id} className="flex items-center gap-3 px-10 py-2.5">
                          {ad.creative?.thumbnail_url && (
                            <img src={ad.creative.thumbnail_url} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
                          )}
                          <span className="text-xs text-base-content/70 flex-1 truncate">{ad.name}</span>
                          <span className={`text-[10px] font-bold ${ad.status === "ACTIVE" ? "text-success" : "text-base-content/30"}`}>
                            {ad.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
