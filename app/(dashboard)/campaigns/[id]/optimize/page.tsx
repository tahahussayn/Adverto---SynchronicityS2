import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Zap, PauseCircle, PlayCircle } from "lucide-react";

export default async function OptimizePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  // Fetch campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select('name, budget_thresholds')
    .eq('id', params.id)
    .single();

  if (!campaign) {
    return redirect("/campaigns");
  }

  // Mock optimization event history (In production, this would query an `audit_logs` or `jobs` table filtered by optimization runs)
  const events = [
    { id: 1, type: 'pause', message: 'Paused "Summer Promo V2" due to high CPA ($22.40 > $15.00 limit).', time: '2 hours ago', icon: PauseCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { id: 2, type: 'generate', message: 'Triggered new creative generation seeded from "Summer Promo V1" (ROAS: 4.2x).', time: '2 hours ago', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 3, type: 'eval', message: 'Evaluated 12 active creatives against budget thresholds. 10 passing, 2 flagged.', time: '12 hours ago', icon: RefreshCw, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 4, type: 'start', message: '24h Optimization Cron Loop initiated by system.', time: '12 hours ago', icon: PlayCircle, color: 'text-slate-400', bg: 'bg-slate-400/10' }
  ];

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto w-full">
      <div className="max-w-3xl mx-auto space-y-8 w-full">
        
        {/* Header */}
        <div className="flex items-center gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Optimization Log</h1>
            <p className="text-slate-400 text-sm mt-1">Autonomous actions taken by the 24h cron loop.</p>
          </div>
        </div>

        {/* Engine Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </div>
            <div>
              <div className="text-slate-100 font-bold">Optimization Engine Active</div>
              <div className="text-slate-400 text-sm">Next evaluation in 14 hours</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500 uppercase">Max CPA</div>
            <div className="text-lg font-mono text-emerald-400">${(campaign.budget_thresholds as any).max_cpa?.toFixed(2)}</div>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="relative pl-6 border-l border-slate-800 space-y-8 mt-12">
          {events.map(event => (
            <div key={event.id} className="relative">
              <div className={`absolute -left-[41px] top-0 w-10 h-10 rounded-full border-4 border-slate-950 ${event.bg} ${event.color} flex items-center justify-center`}>
                <event.icon className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
                <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{event.time}</div>
                <div className="text-slate-200 text-sm leading-relaxed">{event.message}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
