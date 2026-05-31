import { TrendingUp, Users, MousePointerClick, DollarSign, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  const kpis = [
    { label: "Total Spend", value: "$14,250", change: "+12.5%", isPositive: true, icon: DollarSign, color: "text-electric-blue" },
    { label: "Impressions", value: "1.2M", change: "+5.2%", isPositive: true, icon: Users, color: "text-meta-blue" },
    { label: "Avg. CTR", value: "3.4%", change: "+0.8%", isPositive: true, icon: MousePointerClick, color: "text-emerald-400" },
    { label: "Avg. ROAS", value: "3.8x", change: "-0.2x", isPositive: false, icon: TrendingUp, color: "text-purple-400" }
  ];

  const chartData = [
    { day: "Mon", spend: 30, return: 45 },
    { day: "Tue", spend: 40, return: 55 },
    { day: "Wed", spend: 35, return: 60 },
    { day: "Thu", spend: 45, return: 70 },
    { day: "Fri", spend: 55, return: 85 },
    { day: "Sat", spend: 65, return: 100 },
    { day: "Sun", spend: 50, return: 80 },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-lg py-lg h-full overflow-y-auto">
      <header className="mb-lg">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-1">Analytics</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Performance metrics overview</p>
      </header>
      
      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-panel bg-surface-container-lowest/50 border border-outline-variant rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-surface-container-high border border-outline-variant ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {kpi.change}
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
              </div>
            </div>
            <div>
              <div className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-1">{kpi.label}</div>
              <div className="font-headline-lg text-3xl text-on-surface">{kpi.value}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md pb-lg">
        {/* Mock Chart Section */}
        <section className="lg:col-span-2 glass-panel bg-surface-container-lowest/30 border border-outline-variant rounded-2xl p-6 flex flex-col h-full min-h-[300px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline-lg text-lg text-on-surface">Spend vs Return (7 Days)</h3>
            <div className="flex items-center gap-4 text-xs font-label-sm uppercase tracking-wider">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-surface-container-high border border-outline-variant"></span> Spend</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary border border-primary/50"></span> Return</div>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto relative pt-4">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              {[0, 1, 2, 3].map(i => <div key={i} className="w-full h-[1px] bg-white"></div>)}
            </div>
            {/* Bars */}
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 relative z-10 h-full justify-end group">
                <div className="flex gap-1 w-full max-w-[40px] items-end justify-center h-full pb-6">
                  <div className="w-1/2 bg-surface-container-high border-t border-outline-variant rounded-t-sm transition-all duration-500 group-hover:brightness-125" style={{ height: `${d.spend}%` }}></div>
                  <div className="w-1/2 bg-primary rounded-t-sm transition-all duration-500 group-hover:brightness-110 shadow-[0_0_10px_rgba(14,165,233,0.3)]" style={{ height: `${d.return}%` }}></div>
                </div>
                <span className="text-xs text-on-surface-variant font-label-sm uppercase absolute bottom-0">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Performing Creatives */}
        <section className="glass-panel bg-surface-container-lowest/30 border border-outline-variant rounded-2xl p-6 flex flex-col h-full">
          <h3 className="font-headline-lg text-lg text-on-surface mb-6">Top Creatives</h3>
          <div className="flex flex-col gap-4 flex-1 justify-between">
            {[
              { name: "Neon Cyberpunk Kicks", format: "Static", roas: "4.2x", spend: "$1.2k" },
              { name: "Minimalist Watch Promo", format: "Video", roas: "3.8x", spend: "$850" },
              { name: "Summer Sale Carousel", format: "Carousel", roas: "3.5x", spend: "$2.1k" },
              { name: "Urban Streetwear Drop", format: "Static", roas: "3.1x", spend: "$640" },
              { name: "Luxury Perfume Intro", format: "Video", roas: "2.9x", spend: "$420" },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/50 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant/50 border border-outline-variant font-bold text-xs group-hover:text-primary transition-colors">
                    {i+1}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-on-surface max-w-[120px] sm:max-w-[150px] truncate group-hover:text-primary transition-colors">{c.name}</div>
                    <div className="text-xs text-on-surface-variant font-label-sm uppercase tracking-wider">{c.format}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400 text-sm">{c.roas}</div>
                  <div className="text-xs text-on-surface-variant font-label-sm">{c.spend}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
