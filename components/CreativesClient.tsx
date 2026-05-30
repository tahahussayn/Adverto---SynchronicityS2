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
    setOptimisticStatuses((prev) => ({ ...prev, [id]: "publishing" }));
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filter bar */}
      <div className="px-6 py-3 bg-base-200 border-b border-base-300 flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-xs rounded-full ${filter === f ? "btn-primary" : "btn-ghost"}`}
          >
            {f}
            {f === "PENDING" && mapped.filter((c) => c.status === "pending_approval").length > 0 && (
              <span className="badge badge-xs badge-warning ml-1">
                {mapped.filter((c) => c.status === "pending_approval").length}
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-base-content/40 font-bold">{filtered.length} creatives</span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-base-content/30">
            <LayoutGrid className="w-10 h-10" />
            <span className="font-bold">No creatives found</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((creative) => {
              const FormatIcon = FORMAT_ICON[creative.format_type] ?? Image;
              return (
                <div key={creative.id} className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden flex flex-col hover:border-primary/40 transition-colors">
                  {/* Image */}
                  <div className="aspect-square bg-base-300 relative">
                    {creative.image_url ? (
                      <img src={creative.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/20">
                        <FormatIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 badge badge-xs bg-base-100/80 text-base-content gap-1">
                      <FormatIcon className="w-2.5 h-2.5" />
                      {creative.format_type}
                    </span>
                    <span className={`absolute top-2 right-2 badge badge-xs ${STATUS_BADGE[creative.status] ?? "badge-neutral"}`}>
                      {creative.status === "pending_approval" ? "pending" : creative.status}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    {editingId === creative.id ? (
                      <div className="flex flex-col gap-1.5">
                        <input
                          ref={headlineRef}
                          value={editDraft.headline}
                          onChange={(e) => setEditDraft((d) => ({ ...d, headline: e.target.value }))}
                          placeholder="Headline"
                          className="input input-xs input-bordered w-full font-bold"
                          maxLength={40}
                        />
                        <textarea
                          value={editDraft.body_copy}
                          onChange={(e) => setEditDraft((d) => ({ ...d, body_copy: e.target.value }))}
                          placeholder="Body copy"
                          className="textarea textarea-xs textarea-bordered w-full text-[11px] resize-none"
                          rows={2}
                          maxLength={125}
                        />
                        <div className="flex gap-1 mt-0.5">
                          <button onClick={() => saveEdit(creative.id)} className="btn btn-xs btn-success gap-1 flex-1">
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button onClick={cancelEdit} className="btn btn-xs btn-ghost gap-1">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative">
                        <p className="font-bold text-xs text-base-content leading-tight line-clamp-2">
                          {creative.headline || <span className="text-base-content/30 italic">No headline</span>}
                        </p>
                        <p className="text-[11px] text-base-content/50 line-clamp-2 mt-0.5">
                          {creative.body_copy || <span className="italic">No copy</span>}
                        </p>
                        <button
                          onClick={() => startEdit(creative)}
                          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity btn btn-xs btn-ghost p-0.5"
                          title="Edit headline & copy"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-2">
                      {creative.status === "pending_approval" && (
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleStatusUpdate(creative.id, "approved")}
                            className="btn btn-xs btn-success gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(creative.id, "rejected")}
                            className="btn btn-xs btn-error btn-outline gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      )}
                      {creative.status === "approved" && (
                        <button
                          onClick={() => handlePublish(creative.id)}
                          className="btn btn-xs btn-primary w-full gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Publish to Meta
                        </button>
                      )}
                      {creative.status === "published" && (
                        <button
                          onClick={() => handleStatusUpdate(creative.id, "paused")}
                          className="btn btn-xs btn-ghost w-full gap-1 text-base-content/50"
                        >
                          <Pause className="w-3 h-3" />
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
