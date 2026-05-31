"use client";

import { useState, useRef } from "react";
import { useCreatives } from "@/hooks/useCreatives";
import { CheckCircle2, XCircle, Send, Image, Video, LayoutGrid, Pause, Pencil, Check, X } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  generating: "badge-info",
  pending_approval: "badge-warning",
  approved: "badge-success",
  publishing: "badge-info",
  published: "badge-primary",
  paused: "badge-neutral",
  rejected: "badge-error",
};

const FORMAT_ICON: Record<string, any> = {
  Static: Image,
  Video: Video,
  Carousel: LayoutGrid,
};

const FILTERS = ["ALL", "PENDING", "APPROVED", "PUBLISHED", "PAUSED"];

export default function CreativesClient({ campaignId }: { campaignId: string }) {
  const creatives = useCreatives(campaignId);
  const [filter, setFilter] = useState("ALL");
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ headline: string; body_copy: string }>({ headline: "", body_copy: "" });
  const headlineRef = useRef<HTMLInputElement>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setOptimisticStatuses((prev) => ({ ...prev, [id]: newStatus }));
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.from("creatives").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    } catch {
      setOptimisticStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const startEdit = (creative: { id: string; headline: string | null; body_copy: string | null }) => {
    setEditingId(creative.id);
    setEditDraft({ headline: creative.headline ?? "", body_copy: creative.body_copy ?? "" });
    setTimeout(() => headlineRef.current?.focus(), 50);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("creatives").update({ headline: editDraft.headline, body_copy: editDraft.body_copy }).eq("id", id);
    setEditingId(null);
  };

  const handlePublish = async (id: string) => {
    setOptimisticStatuses((prev) => ({ ...prev, [id]: "published" }));
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creativeId: id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setOptimisticStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      alert("Failed to publish to Meta.");
    }
  };

  const mapped = creatives
    .filter((c) => c.status !== "generating" && c.status !== "failed")
    .map((c) => ({ ...c, status: optimisticStatuses[c.id] || c.status }));

  const filtered = mapped.filter((c) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return c.status === "pending_approval";
    return c.status.toUpperCase() === filter;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full">
      {/* Filter bar */}
      <div className="px-md py-sm bg-surface-container-lowest/30 border-b border-outline-variant/30 flex items-center gap-2 w-full">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full font-label-sm text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === f 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-on-surface-variant border border-transparent hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {f}
            {f === "PENDING" && mapped.filter((c) => c.status === "pending_approval").length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#422B00] text-[#FFB300] border border-[#664200]">
                {mapped.filter((c) => c.status === "pending_approval").length}
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
          {filtered.length} creatives
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-lg w-full">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-on-surface-variant font-body-md select-none">
            <LayoutGrid className="w-10 h-10 opacity-50" />
            <span className="font-label-sm uppercase tracking-wider text-xs">No creatives found</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-md">
            {filtered.map((creative) => {
              const FormatIcon = FORMAT_ICON[creative.format_type] ?? Image;
              return (
                <div key={creative.id} className="glass-panel bg-surface-container-lowest/50 rounded-2xl border border-outline-variant overflow-hidden flex flex-col hover:border-primary/40 transition-colors shadow-lg">
                  {/* Image */}
                  <div className="aspect-square bg-surface-container-low relative">
                    {creative.image_url ? (
                      <img src={creative.image_url} alt="" className="w-full h-full object-cover border-b border-outline-variant" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <FormatIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-1 rounded bg-surface/80 backdrop-blur-md text-on-surface text-[10px] font-bold uppercase border border-outline-variant flex items-center gap-1 shadow-md">
                      <FormatIcon className="w-2.5 h-2.5" />
                      {creative.format_type}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-1 rounded bg-surface-container-highest/80 backdrop-blur-md text-on-surface text-[10px] font-bold uppercase border border-outline-variant shadow-md">
                      {creative.status === "pending_approval" ? "pending" : creative.status}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1 bg-surface-container-lowest/30">
                    {editingId === creative.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          ref={headlineRef}
                          value={editDraft.headline}
                          onChange={(e) => setEditDraft((d) => ({ ...d, headline: e.target.value }))}
                          placeholder="Headline"
                          className="bg-surface-container-high border border-outline-variant rounded px-2 py-1 text-xs font-bold text-on-surface outline-none focus:border-primary transition-colors w-full"
                          maxLength={40}
                        />
                        <textarea
                          value={editDraft.body_copy}
                          onChange={(e) => setEditDraft((d) => ({ ...d, body_copy: e.target.value }))}
                          placeholder="Body copy"
                          className="bg-surface-container-high border border-outline-variant rounded px-2 py-1 text-[11px] text-on-surface outline-none focus:border-primary transition-colors w-full resize-none"
                          rows={2}
                          maxLength={125}
                        />
                        <div className="flex gap-1 mt-1">
                          <button onClick={() => saveEdit(creative.id)} className="flex-1 py-1 rounded bg-[#163321] text-[#4ADE80] border border-[#214E34] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#214E34]">
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button onClick={cancelEdit} className="w-8 py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center border border-outline-variant transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative pr-4">
                        <p className="font-bold text-sm text-on-surface leading-tight line-clamp-2">
                          {creative.headline || <span className="text-on-surface-variant italic font-normal">No headline</span>}
                        </p>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1">
                          {creative.body_copy || <span className="italic">No copy</span>}
                        </p>
                        <button
                          onClick={() => startEdit(creative)}
                          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/10"
                          title="Edit headline & copy"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-4">
                      {creative.status === "pending_approval" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleStatusUpdate(creative.id, "approved")}
                            className="py-1.5 rounded bg-[#163321] text-[#4ADE80] border border-[#214E34] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#214E34] transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(creative.id, "rejected")}
                            className="py-1.5 rounded bg-error/10 text-error border border-error/20 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-error/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                      {(creative.status === "approved" || creative.status === "publishing") && (
                        <button
                          onClick={() => handlePublish(creative.id)}
                          className="w-full py-1.5 rounded bg-primary text-primary-container font-label-sm text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-95 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {creative.status === "publishing" ? "Force Publish" : "Publish to Meta"}
                        </button>
                      )}
                      {creative.status === "published" && (
                        <button
                          onClick={() => handleStatusUpdate(creative.id, "paused")}
                          className="w-full py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:text-on-surface transition-colors"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          Pause
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
