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
    <div className="min-h-screen bg-slate-950 font-[Inter] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <Link href={`/campaigns/${id}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{campaign.name} Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time performance data from Meta Insights.</p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Total Spend</span>
            </div>
            <div className="text-3xl font-bold text-slate-100">{totalSpend > 0 ? `$${totalSpend.toFixed(2)}` : "—"}</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Avg ROAS</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{avgRoas > 0 ? `${avgRoas.toFixed(2)}x` : "—"}</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Avg CPA</span>
            </div>
            <div className="text-3xl font-bold text-slate-100">{avgCpa > 0 ? `$${avgCpa.toFixed(2)}` : "—"}</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <MousePointer2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Avg CTR</span>
            </div>
            <div className="text-3xl font-bold text-indigo-400">{avgCtr > 0 ? `${(avgCtr * 100).toFixed(2)}%` : "—"}</div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <h2 className="text-lg font-bold text-slate-100">Creative Performance</h2>
            <div className="flex gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">Winners</span>
              <span className="px-3 py-1 rounded-lg bg-red-900/30 text-red-400 border border-red-800/50">Paused</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-bold uppercase text-slate-500">
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
              <tbody className="divide-y divide-slate-800">
                {safeMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No metrics available yet. Publish creatives to begin tracking.
                    </td>
                  </tr>
                ) : (
                  safeMetrics.map((row: any) => {
                    const isLoser = row.creatives.status === 'paused';
                    const isWinner = row.roas > (campaign.budget_thresholds as any).min_roas;
                    
                    return (
                      <tr key={row.id} className={`hover:bg-slate-800/50 transition-colors ${isLoser ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={row.creatives.image_url || 'https://via.placeholder.com/40'} alt="Thumbnail" className="w-10 h-10 rounded-lg object-cover" />
                          <div className="max-w-[200px] truncate font-medium text-slate-100">
                            {row.creatives.headline || 'Untitled Ad'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${isLoser ? 'bg-slate-800 text-slate-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                            {row.creatives.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">${row.spend?.toFixed(2) || '0.00'}</td>
                        <td className={`px-6 py-4 font-mono font-bold ${isLoser ? 'text-red-400' : ''}`}>${row.cpa?.toFixed(2) || '0.00'}</td>
                        <td className={`px-6 py-4 font-mono font-bold ${isWinner ? 'text-emerald-400' : ''}`}>{row.roas?.toFixed(2) || '0.00'}x</td>
                        <td className="px-6 py-4 font-mono">{(row.ctr * 100)?.toFixed(2) || '0.00'}%</td>
                        <td className="px-6 py-4 font-mono">{row.conversions || 0}</td>
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
