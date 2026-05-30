"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Settings2, Target, DollarSign, PenTool } from "lucide-react";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("CONVERSIONS");
  const [maxCpa, setMaxCpa] = useState("15.00");
  const [minRoas, setMinRoas] = useState("2.5");
  const [minCtr, setMinCtr] = useState("0.008");
  const [brief, setBrief] = useState("");

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Campaign name is required.");

    setIsSubmitting(true);

    const res = await fetch('/api/meta/create-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        objective,
        brief: brief.trim() || null,
        budget_thresholds: {
          max_cpa: parseFloat(maxCpa) || 15.00,
          min_roas: parseFloat(minRoas) || 2.5,
          min_ctr: parseFloat(minCtr) || 0.008,
          min_spend_before_eval: 50.00,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to create campaign:', data.error);
      alert('Failed to create campaign: ' + data.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/campaigns/${data.campaign.id}`);
  };

  return (
    <div className="h-screen bg-slate-950 font-[Inter] flex flex-col overflow-hidden relative">
      {/* Stitch-style Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #64748b 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header / Toolbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/campaigns')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">Draft Campaign</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">Unsaved</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/campaigns')}
            className="px-4 py-2 font-bold text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateCampaign}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 border border-slate-800 rounded-xl font-bold text-sm text-slate-100 shadow-lg shadow-indigo-500/20 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Initializing..." : "Initialize Workspace"}
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 flex overflow-hidden z-10 p-6 gap-6 justify-center">
        
        {/* Left Column: Configuration */}
        <div className="w-[400px] flex flex-col gap-6 overflow-y-auto pb-10 scrollbar-hide">
          
          {/* Core Info Panel */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 mb-6 text-slate-100">
              <Target className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-lg">Core Details</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Q3 Summer Acquisition"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Objective</label>
                <div className="grid grid-cols-2 gap-2">
                  {['CONVERSIONS', 'TRAFFIC', 'LEADS', 'AWARENESS'].map(obj => (
                    <button
                      key={obj}
                      onClick={() => setObjective(obj)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        objective === obj 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Engine Panel */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 mb-6 text-slate-100">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-lg">Optimization Engine</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Max CPA ($)</span>
                  <span className="text-emerald-400">{maxCpa}</span>
                </label>
                <input 
                  type="range" min="1" max="100" step="0.5"
                  value={maxCpa} onChange={e => setMaxCpa(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Min Target ROAS (x)</span>
                  <span className="text-emerald-400">{minRoas}</span>
                </label>
                <input 
                  type="range" min="0.5" max="10" step="0.1"
                  value={minRoas} onChange={e => setMinRoas(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stop Loss CTR Threshold (%)</label>
                <input 
                  type="number" step="0.001"
                  value={minCtr} onChange={e => setMinCtr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Creative Canvas */}
        <div className="flex-1 max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          <div className="h-14 border-b border-slate-800 flex items-center px-6 gap-2 bg-slate-950/50">
            <PenTool className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-sm text-slate-300">Initial AI Brief (Optional)</span>
          </div>
          
          <div className="flex-1 p-6 flex flex-col relative">
            <p className="text-sm text-slate-400 mb-4">
              Providing an initial brief allows our autonomous pipeline to immediately begin generating and iterating on creative variants as soon as the workspace is initialized.
            </p>
            
            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder="Describe your product, target audience, and key value propositions. E.g. 'We are launching a new line of ergonomic running shoes targeting marathon runners. Highlight breathability and joint support...'"
              className="flex-1 w-full bg-transparent border-0 resize-none text-slate-100 placeholder:text-slate-700 focus:outline-none text-lg leading-relaxed"
            />

            <div className="absolute bottom-6 right-6">
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 shadow-sm">Static</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 shadow-sm">Video</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 shadow-sm">Carousel</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
