"use client";

import { useState, useRef, useEffect } from "react";
import { useCreatives, type Creative } from "@/hooks/useCreatives";
import { Send, Image, LayoutGrid, Video, Mic, Clapperboard, Paperclip, X, Sparkles, Trash2 } from "lucide-react";

const FORMATS = [
  { label: "Static", icon: Image },
  { label: "Carousel", icon: LayoutGrid },
  { label: "UGC", icon: Mic },
  { label: "Demo", icon: Clapperboard },
  { label: "Motion", icon: Video },
];

const ASPECT_RATIOS = ["1:1", "4:5", "9:16", "16:9"];

const ROW_HEIGHT = 260; // px — target justified-row height (Higgsfield-style)

type SkeletonCard = { id: string; prompt: string; format: string; creativeId?: string };

export default function GenerateClient({
  campaignId,
  campaignName,
  campaignDesc,
  brief: initialBrief,
}: {
  campaignId: string;
  campaignName: string;
  campaignDesc?: string | null;
  brief?: string;
}) {
  const creatives = useCreatives(campaignId);
  const [format, setFormat] = useState("Static");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [skeletons, setSkeletons] = useState<SkeletonCard[]>([]);
  const [referenceImages, setReferenceImages] = useState<{ file: File; previewUrl: string }[]>([]);
  const [selected, setSelected] = useState<Creative | null>(null);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const [brief, setBrief] = useState(initialBrief ?? "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always fetch the latest brief from DB on mount (may have been updated on Overview page)
  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("campaigns")
        .select("brief")
        .eq("id", campaignId)
        .single();
      if (data?.brief) setBrief(data.brief);
    })();
  }, [campaignId]);


  // Close modal on Escape
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // Remove a local skeleton only once its DB row actually appears — seamless handoff
  useEffect(() => {
    setSkeletons((prev) =>
      prev.filter((s) => !(s.creativeId && creatives.some((c) => c.id === s.creativeId)))
    );
  }, [creatives]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 4 - referenceImages.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setReferenceImages((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setReferenceImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const skeletonId = `skel-${Date.now()}`;
    setSkeletons((prev) => [...prev, { id: skeletonId, prompt: prompt.trim(), format }]);
    setIsGenerating(true);

    try {
      // Upload all reference images in parallel
      let referenceImageUrls: string[] = [];
      if (referenceImages.length > 0) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        referenceImageUrls = await Promise.all(
          referenceImages.map(async ({ file }) => {
            const path = `${campaignId}/${Date.now()}-${file.name}`;
            await supabase.storage.from("creative-references").upload(path, file);
            const { data } = supabase.storage.from("creative-references").getPublicUrl(path);
            return data.publicUrl;
          })
        );
        setReferenceImages([]);
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: campaignId,
          campaign_name: campaignName,
          campaign_objective: campaignDesc ?? "",
          campaign_brief: brief,
          user_prompt: prompt.trim(),
          format_type: format,
          aspect_ratio: aspectRatio,
          reference_image_urls: referenceImageUrls,
        }),
      });

      // Tag the local skeleton with its DB creative_id so it's removed
      // only once that exact generating row arrives via realtime (no flicker gap)
      const data = await res.json().catch(() => ({}));
      if (data?.creative_id) {
        setSkeletons((prev) =>
          prev.map((s) => (s.id === skeletonId ? { ...s, creativeId: data.creative_id } : s))
        );
      } else {
        setSkeletons((prev) => prev.filter((s) => s.id !== skeletonId));
      }
      setPrompt("");
    } catch {
      setSkeletons((prev) => prev.filter((s) => s.id !== skeletonId));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.from("creatives").delete().eq("id", id);
      if (error) throw error;
      setSelected(null);
      // realtime DELETE will remove it from the grid
    } catch {
      alert("Failed to delete creative.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Newest first by created_at (fallback: keep fetch order which is already DESC)
  const sorted = [...creatives].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );
  const generatingCreatives = sorted.filter((c) => c.status === "generating");
  const doneCreatives = sorted.filter((c) => c.status !== "generating");
  const isEmpty = doneCreatives.length === 0 && generatingCreatives.length === 0 && skeletons.length === 0;


  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">

      {/* Creative grid — fills the space */}
      <div className="flex-1 overflow-y-auto p-6 pb-36">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-base-content/20 select-none">
            <Sparkles className="w-12 h-12" />
            <p className="text-sm font-semibold">Describe your creative and hit Generate</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {/* Local optimistic skeletons (before DB insert arrives) — square */}
            {skeletons.map((skel) => (
              <div
                key={skel.id}
                className="rounded-2xl overflow-hidden border border-base-300 bg-base-200 relative"
                style={{ height: ROW_HEIGHT, flexGrow: 1, flexBasis: ROW_HEIGHT }}
              >
                <div className="w-full h-full skeleton" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="loading loading-dots loading-xs text-primary" />
                  <span className="text-[10px] text-base-content/60 font-semibold">Queuing…</span>
                </div>
              </div>
            ))}

            {/* DB-backed generating skeletons — square */}
            {generatingCreatives.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl overflow-hidden border border-base-300 bg-base-200 relative"
                style={{ height: ROW_HEIGHT, flexGrow: 1, flexBasis: ROW_HEIGHT }}
              >
                <div className="w-full h-full skeleton" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="loading loading-dots loading-xs text-primary" />
                  <span className="text-[10px] text-base-content/60 font-semibold">Generating…</span>
                </div>
              </div>
            ))}

            {/* Real creatives — justified rows, native aspect ratio */}
            {doneCreatives.map((creative) => {
              const ratio = ratios[creative.id] ?? 1; // width / height
              return (
                <button
                  key={creative.id}
                  onClick={() => setSelected(creative)}
                  className="group relative rounded-2xl overflow-hidden border border-base-300 bg-base-200 hover:border-primary/40 transition-colors cursor-pointer"
                  style={{ height: ROW_HEIGHT, flexGrow: ratio, flexBasis: ROW_HEIGHT * ratio }}
                >
                  {creative.image_url ? (
                    <img
                      src={creative.image_url}
                      alt={creative.headline ?? "Creative"}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        const r = img.naturalWidth / img.naturalHeight;
                        setRatios((prev) => (prev[creative.id] === r ? prev : { ...prev, [creative.id]: r }));
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-base-300 flex items-center justify-center">
                      <Image className="w-8 h-8 text-base-content/20" />
                    </div>
                  )}

                  {/* Status badge */}
                  <span className={`absolute top-2 right-2 badge badge-xs ${
                    creative.status === "pending_approval" ? "badge-warning" :
                    creative.status === "approved" ? "badge-success" :
                    creative.status === "published" ? "badge-primary" : "badge-neutral"
                  }`}>
                    {creative.status === "pending_approval" ? "pending" : creative.status}
                  </span>

                  {/* Title overlay on hover */}
                  {(creative.headline || creative.body_copy) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity text-left">
                      {creative.headline && (
                        <p className="text-xs font-bold text-white leading-tight line-clamp-1">{creative.headline}</p>
                      )}
                      {creative.body_copy && (
                        <p className="text-[11px] text-white/70 mt-0.5 line-clamp-2">{creative.body_copy}</p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Spacer so the last row doesn't stretch its items full-width */}
            <span className="grow-[999]" style={{ flexBasis: 0 }} aria-hidden />
          </div>
        )}
      </div>

      {/* Creative detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-base-100 rounded-2xl border border-base-300 shadow-2xl overflow-hidden w-full max-w-4xl max-h-[85vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image — left */}
            <div className="md:w-1/2 bg-base-300 flex items-center justify-center shrink-0 max-h-[40vh] md:max-h-none">
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt={selected.headline ?? "Creative"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image className="w-12 h-12 text-base-content/20" />
              )}
            </div>

            {/* Details — right */}
            <div className="md:w-1/2 flex flex-col p-6 overflow-y-auto">
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className={`badge badge-sm ${
                  selected.status === "pending_approval" ? "badge-warning" :
                  selected.status === "approved" ? "badge-success" :
                  selected.status === "published" ? "badge-primary" : "badge-neutral"
                }`}>
                  {selected.status === "pending_approval" ? "pending" : selected.status}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="btn btn-sm btn-ghost btn-square -mt-1.5 -mr-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-1.5">Headline</p>
              <h3 className="font-bold text-xl text-base-content leading-tight mb-5">
                {selected.headline || <span className="text-base-content/30 italic font-normal">No headline</span>}
              </h3>

              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-1.5">Body Copy</p>
              <p className="text-sm text-base-content/70 leading-relaxed mb-5">
                {selected.body_copy || <span className="text-base-content/30 italic">No copy</span>}
              </p>

              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-base-300 text-xs text-base-content/40">
                <span className="font-semibold">{selected.format_type}</span>
                {selected.cta_text && <span>CTA: {selected.cta_text}</span>}
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={isDeleting}
                  className="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-1.5 ml-auto"
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating prompt bar — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="max-w-3xl mx-auto bg-base-300/80 backdrop-blur-md border border-base-300 rounded-2xl shadow-xl overflow-hidden">

          {/* Reference images preview */}
          {referenceImages.length > 0 && (
            <div className="flex items-center gap-2 px-4 pt-3 flex-wrap">
              {referenceImages.map((img, i) => (
                <div key={i} className="relative shrink-0">
                  <img
                    src={img.previewUrl}
                    alt="reference"
                    className="w-10 h-10 rounded-lg object-cover border border-base-300"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-error text-white flex items-center justify-center"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <span className="text-xs text-base-content/40">{referenceImages.length}/4</span>
            </div>
          )}

          {/* Prompt input row */}
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {referenceImages.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-ghost btn-sm btn-square shrink-0 text-base-content/40 hover:text-base-content"
                title="Add reference images (max 4)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            )}

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the ad creative you want to generate..."
              className="flex-1 bg-transparent resize-none outline-none text-sm text-base-content placeholder:text-base-content/30 py-1.5 max-h-28 min-h-[36px]"
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = `${t.scrollHeight}px`;
              }}
            />

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="btn btn-primary btn-sm gap-1.5 shrink-0 rounded-xl"
            >
              {isGenerating ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Generate
            </button>
          </div>

          {/* Options row */}
          <div className="flex items-center gap-3 px-4 pb-3 pt-0.5 border-t border-base-300/50">
            {/* Format */}
            <div className="flex gap-1 overflow-x-auto">
              {FORMATS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setFormat(label)}
                  className={`btn btn-xs gap-1 rounded-full shrink-0 ${format === label ? "btn-primary" : "btn-ghost opacity-50 hover:opacity-100"}`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-base-content/10 shrink-0" />

            {/* Aspect ratio */}
            <div className="flex gap-1 shrink-0">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`btn btn-xs rounded-full ${aspectRatio === ar ? "btn-neutral" : "btn-ghost opacity-50 hover:opacity-100"}`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
