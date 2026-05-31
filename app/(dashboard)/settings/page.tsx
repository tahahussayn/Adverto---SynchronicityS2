"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase.auth]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { name: "Account", icon: "person" },
    { name: "Meta", icon: "hub" },
    { name: "Brand", icon: "palette" },
    { name: "Billing", icon: "credit_card" },
    { name: "API", icon: "api" },
    { name: "Danger", icon: "warning" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-xl py-lg h-full overflow-y-auto relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-blue/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <header className="mb-xl relative z-10 flex items-end justify-between">
        <div>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-2 font-bold tracking-tight">Settings</h1>
          <p className="font-label-sm text-sm text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-electric-blue">settings</span>
            Manage your workspace and integrations
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-xl max-w-[1200px] w-full relative z-10">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
          {tabs.map(tab => {
            const isDanger = tab.name === 'Danger';
            const isActive = activeTab === tab.name;
            
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 font-label-sm uppercase tracking-wider text-xs transition-all rounded-xl border ${
                  isDanger 
                    ? (isActive 
                        ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                        : 'border-transparent text-red-400/70 hover:text-red-400 hover:bg-red-500/5')
                    : (isActive 
                        ? 'bg-surface-container-high text-white border-outline-variant shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                        : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-low')
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {activeTab === "Account" && (
            <div className="glass-panel-heavy border border-[#333] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue to-transparent"></div>
              <h2 className="font-headline-lg text-2xl mb-8 text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-electric-blue">person</span>
                Account Profile
              </h2>

              <div className="space-y-6 max-w-xl">
                <div className="group flex flex-col w-full md:w-[400px]">
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2 group-focus-within:text-white transition-colors">Full Name</label>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">badge</span>
                    <input type="text" className="w-full min-w-full bg-[#111] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-sm text-white font-body-md focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all outline-none" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" disabled={loading} />
                  </div>
                </div>
                <div className="group flex flex-col w-full md:w-[400px]">
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Email Address</label>
                  <div className="relative opacity-60 cursor-not-allowed w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                    <input type="email" className="w-full min-w-full bg-[#111] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-sm text-white font-body-md outline-none pointer-events-none" value={email} readOnly placeholder="Loading..." />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-[#333] w-full md:w-[400px]">
                  <button onClick={handleSaveProfile} disabled={loading || saving} className="px-8 py-3.5 bg-electric-blue text-white font-label-sm font-bold rounded-full hover:bg-sky-400 hover:scale-95 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center gap-2 disabled:opacity-50">
                    {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Meta" && (
            <div className="glass-panel-heavy border border-[#333] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#1877F2] to-transparent"></div>
              <h2 className="font-headline-lg text-2xl mb-8 text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1877F2]">campaign</span>
                Meta Connection
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[16px]">thumb_up</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Adverto Business Manager</h3>
                      <span className="text-xs font-label-sm text-on-surface-variant">ID: act_1092837465</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-[#163321]/50 border border-[#214E34] text-[#4ADE80] font-label-sm text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_8px_#4ADE80]"></span>
                    Connected & Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 border border-[#333] rounded-xl bg-[#111]">
                  <p className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Token Status</p>
                  <p className="text-white font-body-md text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">verified_user</span>
                    Valid until Nov 12, 2026
                  </p>
                </div>
                <div className="p-5 border border-[#333] rounded-xl bg-[#111]">
                  <p className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">Sync Status</p>
                  <p className="text-white font-body-md text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-electric-blue text-[18px]">cloud_sync</span>
                    Last synced 5 mins ago
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#333] flex items-center gap-4">
                <button className="px-6 py-3 bg-surface-container-high border border-outline-variant text-white font-label-sm rounded-full hover:bg-surface-container transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  Force Sync
                </button>
                <button className="px-6 py-3 text-red-400 font-label-sm rounded-full hover:bg-red-500/10 transition-colors flex items-center gap-2">
                  Disconnect
                </button>
              </div>
            </div>
          )}

          {activeTab === "Brand" && (
            <div className="glass-panel-heavy border border-[#333] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8b5cf6] to-transparent"></div>
              <h2 className="font-headline-lg text-2xl mb-8 text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8b5cf6]">palette</span>
                Brand Identity
              </h2>
              
              <div className="space-y-8 max-w-xl">
                <div className="group flex flex-col w-full md:w-[400px]">
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-2 group-focus-within:text-white transition-colors">Target Website URL</label>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">language</span>
                    <input type="url" className="w-full min-w-full bg-[#111] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-sm text-white font-body-md focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all outline-none" defaultValue="https://mybrand.com" />
                  </div>
                </div>
                
                <div className="w-full md:w-[500px]">
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-3">Copywriting Tone</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {['Bold & Direct', 'Friendly', 'Premium/Luxury'].map(t => (
                      <button key={t} className={`flex-1 py-3 px-2 whitespace-nowrap rounded-xl font-label-sm text-xs transition-all border ${t === 'Bold & Direct' ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'bg-[#111] border-[#333] text-on-surface-variant hover:border-[#555] hover:text-white'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-3">Primary Colors</label>
                  <div className="flex gap-4">
                    {['#111111', '#FAFAFA', '#8B5CF6'].map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 border-2 border-[#333] rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: c }}>
                          {c === '#111111' && <span className="material-symbols-outlined text-white/20">edit</span>}
                          {c === '#FAFAFA' && <span className="material-symbols-outlined text-black/20">edit</span>}
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-label-sm uppercase">{c}</span>
                      </div>
                    ))}
                    <button className="w-14 h-14 border-2 border-dashed border-[#444] rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-white hover:border-[#666] transition-all">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#333] w-full md:w-[400px]">
                  <button className="px-8 py-3.5 whitespace-nowrap bg-white text-black font-label-sm font-bold rounded-full hover:bg-gray-200 hover:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 w-max">
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Save Identity
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Billing" && (
            <div className="glass-panel-heavy border border-[#333] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
              <h2 className="font-headline-lg text-2xl mb-8 text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">credit_card</span>
                Billing & Plan
              </h2>
              
              <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-[#333] rounded-2xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Plan
                    </div>
                    <h3 className="font-headline-lg text-3xl mb-1 text-white">Pro Tier</h3>
                    <p className="text-on-surface-variant font-label-sm">$99 / month</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white text-black font-label-sm font-bold rounded-full hover:scale-95 transition-transform shadow-lg">
                    Upgrade
                  </button>
                </div>
                
                <div className="mb-3 flex justify-between font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant">
                  <span>Generation Usage</span>
                  <span className="text-white">145 / 500 Credits</span>
                </div>
                <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-500 relative" style={{ width: '29%' }}>
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <h3 className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-4">Invoice History</h3>
              <div className="space-y-3">
                {[
                  { date: 'May 1, 2026', amount: '$99.00', status: 'Paid' },
                  { date: 'Apr 1, 2026', amount: '$99.00', status: 'Paid' },
                  { date: 'Mar 1, 2026', amount: '$99.00', status: 'Paid' }
                ].map((inv, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border border-[#333] rounded-xl bg-[#111] hover:bg-[#151515] transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      </div>
                      <div>
                        <p className="font-label-sm text-sm text-white mb-0.5">{inv.date}</p>
                        <p className="text-xs text-on-surface-variant font-body-md flex items-center gap-2">
                          {inv.amount} <span className="w-1 h-1 rounded-full bg-[#444]"></span> <span className="text-emerald-500">{inv.status}</span>
                        </p>
                      </div>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#222] text-on-surface-variant hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "API" && (
            <div className="glass-panel-heavy border border-[#333] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-transparent"></div>
              <h2 className="font-headline-lg text-2xl mb-2 text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-500">api</span>
                API Keys
              </h2>
              <p className="text-sm text-on-surface-variant mb-8">Manage API keys to access Adverto's generation engine programmatically.</p>
              
              <div className="p-6 border border-[#333] rounded-xl bg-[#111] mb-6 flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Production Key</h4>
                  <p className="text-xs text-on-surface-variant font-mono">adv_live_**********************</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#222] text-white hover:bg-[#333] font-label-sm text-xs rounded-lg transition-colors border border-[#444]">Reveal</button>
                  <button className="px-4 py-2 bg-[#222] text-white hover:bg-[#333] font-label-sm text-xs rounded-lg transition-colors border border-[#444]">Revoke</button>
                </div>
              </div>
              
              <button className="px-6 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-label-sm font-bold rounded-full hover:bg-cyan-500/20 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Generate New Key
              </button>
            </div>
          )}

          {activeTab === "Danger" && (
            <div className="glass-panel-heavy border border-red-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.05)]">
              <div className="absolute top-0 left-0 w-full h-full bg-red-500/5 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-transparent"></div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                  <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
                </div>
                <div>
                  <h2 className="font-headline-lg text-2xl mb-2 text-red-500">Danger Zone</h2>
                  <p className="text-on-surface-variant mb-6 font-body-md text-sm max-w-lg leading-relaxed">
                    Once you delete your account, there is no going back. All campaigns, creatives, Meta sync settings, and brand identities will be permanently erased from our servers.
                  </p>
                  
                  <div className="p-4 border border-red-500/30 rounded-xl bg-red-500/10 mb-6 max-w-lg">
                    <label className="block font-label-sm uppercase tracking-widest text-[10px] text-red-400/80 mb-2">Type "delete my account" to confirm</label>
                    <input type="text" className="w-full bg-[#111] border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-white font-body-md focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all outline-none" placeholder="" />
                  </div>

                  <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-label-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
