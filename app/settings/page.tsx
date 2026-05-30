"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");

  const tabs = ["Account", "Meta", "Brand", "Billing", "API", "Danger"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-[Inter] p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-headline-lg font-bold text-3xl mb-12 text-white tracking-tight">Settings</h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-6 py-4 font-label-sm uppercase tracking-widest text-xs transition-all rounded-r-lg ${
                  tab === 'Danger' 
                    ? (activeTab === tab 
                        ? 'bg-rose-500/10 text-rose-400 border-l-2 border-rose-500' 
                        : 'border-l-2 border-transparent text-rose-500/70 hover:text-rose-400 hover:bg-[#111111]')
                    : (activeTab === tab 
                        ? 'bg-white/5 text-white border-l-2 border-electric-blue glow-accent' 
                        : 'border-l-2 border-transparent text-on-surface-variant hover:text-white hover:bg-[#111111]')
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 space-y-8">
            
            {activeTab === "Account" && (
              <div className="glass-panel-heavy rounded-xl p-8 relative glow-accent">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-electric-blue/50 to-transparent opacity-80"></div>
                <h2 className="font-headline-sm font-bold text-xl mb-8 text-white">Account Profile</h2>
                
                <div className="flex gap-8 items-center mb-10">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-electric-blue to-violet-accent p-[2px]">
                    <div className="w-full h-full bg-[#111111] rounded-2xl flex items-center justify-center">
                      <span className="font-headline-lg font-bold text-3xl text-white">U</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-[#161616] border border-[#333] text-white font-label-sm font-bold rounded-lg hover:bg-[#222] transition-colors shadow-sm">
                    Upload Avatar
                  </button>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Full Name</label>
                    <input type="text" className="w-full h-12 bg-[#111111] border border-[#222222] rounded-lg px-4 focus:border-white focus:ring-0 text-white font-label-sm transition-colors" defaultValue="Jane Doe" />
                  </div>
                  <div>
                    <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Email Address</label>
                    <input type="email" className="w-full h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-4 text-on-surface-variant font-label-sm cursor-not-allowed" defaultValue="jane@brand.com" readOnly />
                  </div>
                  <div className="pt-4">
                    <button className="px-8 py-3 bg-white text-[#0A0A0A] font-label-sm font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Meta" && (
              <div className="glass-panel-heavy rounded-xl p-8 relative glow-accent">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent opacity-80"></div>
                <h2 className="font-headline-sm font-bold text-xl mb-8 text-white">Meta Connection</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 font-label-sm font-bold uppercase text-[10px] tracking-wider border border-green-500/20 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Connected
                  </span>
                  <span className="text-sm font-label-sm text-on-surface-variant">ID: act_1092837465</span>
                </div>

                <div className="p-5 border border-[#222] rounded-xl bg-[#111111] mb-8">
                  <p className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Token Expiry</p>
                  <p className="text-white font-body-md text-sm">Valid until Nov 12, 2026 (143 days remaining)</p>
                </div>

                <button className="px-6 py-3 bg-[#161616] border border-[#333] text-white font-label-sm font-bold rounded-lg hover:bg-[#222] transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  Reconnect Meta
                </button>
              </div>
            )}

            {activeTab === "Brand" && (
              <div className="glass-panel-heavy rounded-xl p-8 relative glow-accent">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-violet-accent/50 to-transparent opacity-80"></div>
                <h2 className="font-headline-sm font-bold text-xl mb-8 text-white">Brand Profile</h2>
                
                <div className="space-y-8 max-w-lg">
                  <div>
                    <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Website</label>
                    <input type="url" className="w-full h-12 bg-[#111111] border border-[#222222] rounded-lg px-4 focus:border-white focus:ring-0 text-white font-label-sm transition-colors" defaultValue="https://mybrand.com" />
                  </div>
                  
                  <div>
                    <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-3">Tone of Voice</label>
                    <div className="flex gap-3">
                      {['Bold', 'Friendly', 'Premium'].map(t => (
                        <label key={t} className={`flex-1 text-center py-3 rounded-lg font-label-sm text-sm cursor-pointer transition-all border ${t === 'Bold' ? 'bg-white text-[#0A0A0A] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-[#111111] border-[#222222] text-on-surface-variant hover:border-[#444]'}`}>
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-3">Brand Colors</label>
                    <div className="flex gap-4">
                      {['#FF0000', '#000000', '#FFFFFF'].map(c => (
                        <div key={c} className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 border border-[#333] rounded-full shadow-sm" style={{ backgroundColor: c }}></div>
                          <span className="text-[10px] text-on-surface-variant font-label-sm">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="px-8 py-3 bg-white text-[#0A0A0A] font-label-sm font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Billing" && (
              <div className="glass-panel-heavy rounded-xl p-8 relative glow-accent">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 to-transparent opacity-80"></div>
                <h2 className="font-headline-sm font-bold text-xl mb-8 text-white">Billing & Plan</h2>
                
                <div className="border border-[#222] rounded-xl p-6 mb-8 relative overflow-hidden bg-[#0A0A0A]">
                  <div className="absolute top-0 right-0 bg-electric-blue/10 text-electric-blue px-4 py-1.5 font-label-sm font-bold text-[10px] uppercase tracking-wider border-b border-l border-electric-blue/20 rounded-bl-lg">Active</div>
                  <h3 className="font-headline-sm font-bold text-2xl mb-1 text-white">Pro Plan</h3>
                  <p className="text-on-surface-variant font-label-sm mb-8">$99 / month</p>
                  
                  <div className="mb-3 flex justify-between font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant">
                    <span>Usage</span>
                    <span>145 / 500 Creatives</span>
                  </div>
                  <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-electric-blue shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: '29%' }}></div>
                  </div>

                  <button className="mt-8 px-6 py-3 bg-white text-[#0A0A0A] font-label-sm font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    Upgrade Plan
                  </button>
                </div>

                <h3 className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-4">Invoice History</h3>
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex justify-between items-center p-4 border border-[#222] rounded-lg bg-[#111111] hover:bg-[#161616] transition-colors">
                      <div>
                        <p className="font-label-sm text-sm text-white mb-1">May 1, 2026</p>
                        <p className="text-[11px] text-on-surface-variant font-body-md">Pro Plan - $99.00</p>
                      </div>
                      <button className="text-xs font-label-sm text-electric-blue hover:text-white transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Danger" && (
              <div className="glass-panel-heavy rounded-xl p-8 relative border-rose-500/20">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-rose-500/50 to-transparent opacity-80"></div>
                <h2 className="font-headline-sm font-bold text-xl mb-3 text-rose-400">Danger Zone</h2>
                <p className="text-on-surface-variant mb-8 font-body-md text-sm max-w-md">
                  Once you delete your account, there is no going back. All campaigns, creatives, and brand settings will be permanently erased.
                </p>
                <button className="px-6 py-3 bg-rose-600/10 text-rose-400 border border-rose-500/30 font-label-sm font-bold rounded-lg hover:bg-rose-600/20 hover:border-rose-500/50 transition-colors">
                  Delete Account
                </button>
              </div>
            )}

            {/* API Tab Omitted for brevity, follows same pattern */}

          </div>
        </div>
      </div>
    </div>
  );
}
