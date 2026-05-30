import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, DollarSign, Target, MousePointer2 } from "lucide-react";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  // Fetch campaign and metrics
  const { data: campaign } = await supabase
    .from("campaigns")
    .select('name, budget_thresholds')
    .eq('id', id)
    .single();

  if (!campaign) {
    return redirect("/campaigns");
  }

  const { data: metrics } = await supabase
    .from("performance_metrics")
    .select('*, creatives(headline, image_url, format_type, status)')
    .eq('campaign_id', id)
    .order('metric_date', { ascending: false });

  const safeMetrics = metrics || [];

  const totalSpend = safeMetrics.reduce((s: number, m: any) => s + (m.spend ?? 0), 0);
  const avgRoas = safeMetrics.length ? safeMetrics.reduce((s: number, m: any) => s + (m.roas ?? 0), 0) / safeMetrics.length : 0;
  const avgCpa = safeMetrics.length ? safeMetrics.reduce((s: number, m: any) => s + (m.cpa ?? 0), 0) / safeMetrics.length : 0;
  const avgCtr = safeMetrics.length ? safeMetrics.reduce((s: number, m: any) => s + (m.ctr ?? 0), 0) / safeMetrics.length : 0;

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto space-y-8 w-full">
        
        {/* Header */}
        <div className="flex items-center gap-4 pb-2">
          <div>
            <h1 className="font-headline-lg text-[28px] text-on-surface">Analytics</h1>
            <p className="text-on-surface-variant font-label-sm mt-1 uppercase tracking-wider">Real-time performance data from Meta Insights.</p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel bg-surface-container-lowest/50 border border-outline-variant rounded-2xl p-6 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-label-sm uppercase tracking-wider">Total Spend</span>
            </div>
            <div className="font-headline-lg text-3xl text-on-surface">{totalSpend > 0 ? `$${totalSpend.toFixed(2)}` : "—"}</div>
          </div>
          <div className="glass-panel bg-surface-container-lowest/50 border border-outline-variant rounded-2xl p-6 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4ADE80]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-2 text-[#4ADE80] mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-label-sm uppercase tracking-wider">Avg ROAS</span>
            </div>
            <div className="font-headline-lg text-3xl text-[#4ADE80]">{avgRoas > 0 ? `${avgRoas.toFixed(2)}x` : "—"}</div>
          </div>
          <div className="glass-panel bg-surface-container-lowest/50 border border-outline-variant rounded-2xl p-6 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-label-sm uppercase tracking-wider">Avg CPA</span>
            </div>
            <div className="font-headline-lg text-3xl text-on-surface">{avgCpa > 0 ? `$${avgCpa.toFixed(2)}` : "—"}</div>
          </div>
          <div className="glass-panel bg-surface-container-lowest/50 border border-outline-variant rounded-2xl p-6 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <MousePointer2 className="w-4 h-4" />
              <span className="text-xs font-label-sm uppercase tracking-wider">Avg CTR</span>
            </div>
            <div className="font-headline-lg text-3xl text-indigo-400">{avgCtr > 0 ? `${(avgCtr * 100).toFixed(2)}%` : "—"}</div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="glass-panel bg-surface-container-lowest/50 border border-outline-variant rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-low/30">
            <h2 className="font-headline-lg text-[20px] text-on-surface">Creative Performance</h2>
            <div className="flex gap-2 font-label-sm text-[10px] uppercase tracking-wider">
              <span className="px-3 py-1 rounded border bg-[#163321] text-[#4ADE80] border-[#214E34]">Winners</span>
              <span className="px-3 py-1 rounded border bg-error/10 text-error border-error/20">Paused</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-container-low/50 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">
                <tr>
                  <th className="px-6 py-4">Creative</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Spend</th>
                  <th className="px-6 py-4">CPA</th>
                  <th className="px-6 py-4">ROAS</th>
                  <th className="px-6 py-4">CTR</th>
                  <th className="px-6 py-4">Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {safeMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-body-md">
                      No metrics available yet. Publish creatives to begin tracking.
                    </td>
                  </tr>
                ) : (
                  safeMetrics.map((row: any) => {
                    const isLoser = row.creatives.status === 'paused';
                    const isWinner = row.roas > (campaign.budget_thresholds as any).min_roas;
                    
                    return (
                      <tr key={row.id} className={`hover:bg-surface-container-high transition-colors ${isLoser ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={row.creatives.image_url || 'https://via.placeholder.com/40'} alt="Thumbnail" className="w-10 h-10 rounded-lg object-cover border border-outline-variant" />
                          <div className="max-w-[200px] truncate font-medium text-on-surface">
                            {row.creatives.headline || 'Untitled Ad'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${isLoser ? 'bg-surface-container-high text-on-surface-variant border-outline-variant' : 'bg-[#163321] text-[#4ADE80] border-[#214E34]'}`}>
                            {row.creatives.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">${row.spend?.toFixed(2) || '0.00'}</td>
                        <td className={`px-6 py-4 font-mono text-sm font-bold ${isLoser ? 'text-error' : ''}`}>${row.cpa?.toFixed(2) || '0.00'}</td>
                        <td className={`px-6 py-4 font-mono text-sm font-bold ${isWinner ? 'text-[#4ADE80]' : ''}`}>{row.roas?.toFixed(2) || '0.00'}x</td>
                        <td className="px-6 py-4 font-mono text-sm">{(row.ctr * 100)?.toFixed(2) || '0.00'}%</td>
                        <td className="px-6 py-4 font-mono text-sm">{row.conversions || 0}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
