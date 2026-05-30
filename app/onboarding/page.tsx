"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  // Step 2 state
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("ecommerce");
  const [tone, setTone] = useState("Bold");

  // Step 3 state
  const [campaignUrl, setCampaignUrl] = useState("");
  const [brief, setBrief] = useState("");
  const [budget, setBudget] = useState("");

  const handleConnectMeta = async () => {
    const res = await fetch('/api/meta/connect-sandbox');
    if (res.ok) {
      setStep(2);
    } else {
      // If endpoint doesn't exist yet, just proceed for the UI demo
      setStep(2);
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setStep(3);
    } else {
      // Allow proceeding in UI even if unauthenticated for preview
      setStep(3);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to create a campaign.');
      return;
    }

    // Ensure user exists in public.users to satisfy foreign key constraint
    await supabase.from('users').upsert({ 
      id: user.id, 
      email: user.email || ''
    }, { onConflict: 'id' });

    // Create campaign
    const { data: campaign, error } = await supabase.from('campaigns').insert({
      user_id: user.id,
      name: `Campaign for ${campaignUrl}`,
      objective: 'CONVERSIONS',
      budget_thresholds: { max_cpa: parseFloat(budget) || 15.00, min_roas: 2.5, min_ctr: 0.008, min_spend_before_eval: 50.00 }
    }).select().single();

    if (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign: ' + error.message);
      return;
    }

    if (campaign) {
      router.push(`/campaigns/${campaign.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center pt-24 pb-12 px-4">
      
      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-16 flex items-center justify-between relative">
        <div className="absolute left-0 right-0 h-[2px] bg-[#222222] top-1/2 -translate-y-1/2 z-0"></div>
        
        {[1, 2, 3].map((num) => (
          <div 
            key={num}
            className={`relative z-10 w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full transition-all duration-300
              ${step === num 
                ? 'bg-white text-[#0A0A0A] shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110' 
                : step > num 
                  ? 'bg-white text-[#0A0A0A]' 
                  : 'bg-[#111111] border-2 border-[#222222] text-on-surface-variant'}`}
          >
            {step > num ? <span className="material-symbols-outlined text-[20px]">check</span> : num}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg glass-panel-heavy rounded-xl p-8 relative glow-accent">
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue to-violet-accent rounded-t-xl opacity-80"></div>

        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <span className="font-bold text-blue-500 text-4xl font-headline-lg">M</span>
            </div>
            <h2 className="font-headline-lg text-2xl font-bold text-white mb-3">Connect your Ad Account</h2>
            <p className="font-body-md text-sm text-on-surface-variant mb-10 leading-relaxed">
              We need access to your Meta Ads account to autonomously generate, publish, and optimize your creatives round the clock.
            </p>
            <button 
              onClick={handleConnectMeta}
              className="w-full bg-blue-600 text-white font-label-sm font-bold py-4 rounded-lg hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">link</span>
              Connect Meta Ads
            </button>
            <button onClick={() => setStep(2)} className="mt-6 text-xs text-on-surface-variant font-label-sm uppercase tracking-wider hover:text-white transition-colors block w-full">
              Skip for now
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSaveBrand} className="space-y-6">
            <div className="mb-8">
              <h2 className="font-headline-lg text-2xl font-bold text-white mb-2">Brand Profile</h2>
              <p className="font-body-md text-sm text-on-surface-variant">Tell our agents about your brand's unique identity.</p>
            </div>
            
            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-2">Brand Name</label>
              <input 
                type="text" required placeholder="Adverto AI"
                value={brandName} onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] rounded-lg py-3 px-4 font-label-sm text-sm text-white placeholder-outline-variant focus:border-white focus:ring-0 transition-colors" 
              />
            </div>

            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-2">Website URL</label>
              <input 
                type="url" required placeholder="https://adverto.ai"
                value={website} onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] rounded-lg py-3 px-4 font-label-sm text-sm text-white placeholder-outline-variant focus:border-white focus:ring-0 transition-colors" 
              />
            </div>

            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-2">Category</label>
              <div className="relative">
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111111] border border-[#222222] rounded-lg py-3 px-4 font-label-sm text-sm text-white focus:border-white focus:ring-0 transition-colors appearance-none"
                >
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="service">Service Business</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-3">Tone of Voice</label>
              <div className="flex gap-3">
                {['Bold', 'Friendly', 'Premium'].map(t => (
                  <label key={t} className={`flex-1 text-center py-3 rounded-lg font-label-sm text-sm cursor-pointer transition-all border ${tone === t ? 'bg-white text-[#0A0A0A] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-[#111111] border-[#222222] text-on-surface-variant hover:border-[#444]'}`}>
                    <input type="radio" name="tone" value={t} checked={tone === t} onChange={(e) => setTone(e.target.value)} className="hidden" />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-white text-[#0A0A0A] font-label-sm font-bold py-4 rounded-lg hover:scale-[1.02] transition-transform duration-200 glow-accent-hover flex items-center justify-center gap-2">
                Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button type="button" onClick={() => setStep(3)} className="mt-4 text-xs text-on-surface-variant font-label-sm uppercase tracking-wider hover:text-white transition-colors block w-full text-center">
                Skip for now
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCreateCampaign} className="space-y-6">
            <div className="mb-8">
              <h2 className="font-headline-lg text-2xl font-bold text-white mb-2">First Campaign</h2>
              <p className="font-body-md text-sm text-on-surface-variant">Provide the brief and let our agents start generating.</p>
            </div>
            
            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-2">Target URL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">link</span>
                <input 
                  type="url" required placeholder="https://..."
                  value={campaignUrl} onChange={(e) => setCampaignUrl(e.target.value)}
                  className="w-full bg-[#111111] border border-[#222222] rounded-lg py-3 pl-11 pr-4 font-label-sm text-sm text-white placeholder-outline-variant focus:border-white focus:ring-0 transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-2">Campaign Brief</label>
              <textarea 
                required rows={4} placeholder="Describe the product, target audience, and key selling points..."
                value={brief} onChange={(e) => setBrief(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] rounded-lg p-4 font-body-md text-sm text-white placeholder-outline-variant focus:border-white focus:ring-0 transition-colors resize-none" 
              />
            </div>

            <div>
              <label className="block font-label-sm uppercase tracking-widest text-xs text-on-surface-variant mb-2">Target CPA ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-label-sm font-bold text-outline-variant">$</span>
                <input 
                  type="number" required placeholder="15.00" step="0.01"
                  value={budget} onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#111111] border border-[#222222] rounded-lg py-3 pl-9 pr-4 font-label-sm text-sm text-white placeholder-outline-variant focus:border-white focus:ring-0 transition-colors" 
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-white text-[#0A0A0A] font-label-sm font-bold py-4 rounded-lg hover:scale-[1.02] transition-transform duration-200 glow-accent-hover flex items-center justify-center gap-2">
                Launch Agents <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
