"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");

  const tabs = ["Account", "Meta", "Brand", "Billing", "API", "Danger"];

  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-lg py-lg h-full overflow-y-auto">
      <header className="mb-lg">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-1">Settings</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Manage your workspace</p>
      </header>

      <div className="flex flex-col md:flex-row gap-lg max-w-6xl w-full">
        {/* Left Sidebar */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-xs">
          {tabs.map(tab => {
            const isDanger = tab === 'Danger';
            const isActive = activeTab === tab;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-md py-sm font-label-sm uppercase tracking-widest text-xs transition-all rounded-r-lg ${
                  isDanger 
                    ? (isActive 
                        ? 'bg-error-container/20 text-error border-l-2 border-error' 
                        : 'border-l-2 border-transparent text-error/70 hover:text-error hover:bg-surface-container-low')
                    : (isActive 
                        ? 'bg-primary/5 text-primary border-l-2 border-primary' 
                        : 'border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low')
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-8">
          
          {activeTab === "Account" && (
            <div className="glass-panel border border-outline-variant rounded-xl p-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 to-transparent"></div>
              <h2 className="font-headline-lg text-xl mb-xl text-on-surface">Account Profile</h2>
              
              <div className="flex gap-md items-center mb-xl">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-outline p-[2px]">
                  <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center">
                    <span className="font-headline-lg text-3xl text-on-surface">U</span>
                  </div>
                </div>
                <button className="px-md py-sm bg-surface-container-high border border-outline-variant text-on-surface font-label-sm rounded hover:bg-surface-container transition-colors">
                  Upload Avatar
                </button>
              </div>

              <div className="space-y-md max-w-lg">
                <div>
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-xs">Full Name</label>
                  <input type="text" className="w-full bg-surface border border-outline-variant rounded p-3 text-sm text-on-surface font-body-md focus:border-on-surface focus:ring-0 transition-colors" defaultValue="Jane Doe" />
                </div>
                <div>
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-xs">Email Address</label>
                  <input type="email" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-3 text-sm text-on-surface-variant font-body-md cursor-not-allowed" defaultValue="jane@brand.com" readOnly />
                </div>
                <div className="pt-sm">
                  <button className="px-md py-sm bg-on-surface text-primary-container font-label-sm uppercase rounded hover:scale-95 transition-transform">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Meta" && (
            <div className="glass-panel border border-outline-variant rounded-xl p-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#1877F2]/50 to-transparent"></div>
              <h2 className="font-headline-lg text-xl mb-xl text-on-surface">Meta Connection</h2>
              
              <div className="flex items-center gap-sm mb-lg">
                <span className="bg-[#163321] border border-[#214E34] text-[#4ADE80] font-label-sm text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]"></span>
                  Connected
                </span>
                <span className="text-sm font-label-sm text-on-surface-variant">ID: act_1092837465</span>
              </div>

              <div className="p-sm border border-outline-variant rounded bg-surface mb-lg">
                <p className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-1">Token Expiry</p>
                <p className="text-on-surface font-body-md text-sm">Valid until Nov 12, 2026 (143 days remaining)</p>
              </div>

              <button className="px-md py-sm bg-surface-container-high border border-outline-variant text-on-surface font-label-sm rounded hover:bg-surface-container transition-colors flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Reconnect Meta
              </button>
            </div>
          )}

          {activeTab === "Brand" && (
            <div className="glass-panel border border-outline-variant rounded-xl p-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#8A2BE2]/50 to-transparent"></div>
              <h2 className="font-headline-lg text-xl mb-xl text-on-surface">Brand Profile</h2>
              
              <div className="space-y-lg max-w-lg">
                <div>
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-xs">Website</label>
                  <input type="url" className="w-full bg-surface border border-outline-variant rounded p-3 text-sm text-on-surface font-body-md focus:border-on-surface focus:ring-0 transition-colors" defaultValue="https://mybrand.com" />
                </div>
                
                <div>
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-sm">Tone of Voice</label>
                  <div className="flex gap-sm">
                    {['Bold', 'Friendly', 'Premium'].map(t => (
                      <label key={t} className={`flex-1 text-center py-2 rounded font-label-sm text-xs cursor-pointer transition-all border ${t === 'Bold' ? 'bg-primary/20 text-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}>
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-sm">Brand Colors</label>
                  <div className="flex gap-md">
                    {['#FF0000', '#000000', '#FFFFFF'].map(c => (
                      <div key={c} className="flex flex-col items-center gap-xs">
                        <div className="w-12 h-12 border border-outline-variant rounded-full shadow-sm" style={{ backgroundColor: c }}></div>
                        <span className="text-[10px] text-on-surface-variant font-label-sm">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-sm">
                  <button className="px-md py-sm bg-on-surface text-primary-container font-label-sm uppercase rounded hover:scale-95 transition-transform">
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Billing" && (
            <div className="glass-panel border border-outline-variant rounded-xl p-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 to-transparent"></div>
              <h2 className="font-headline-lg text-xl mb-xl text-on-surface">Billing & Plan</h2>
              
              <div className="border border-outline-variant rounded p-md mb-lg relative overflow-hidden bg-surface">
                <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 font-label-sm text-[10px] uppercase tracking-wider border-b border-l border-primary/20 rounded-bl-sm">Active</div>
                <h3 className="font-headline-lg text-2xl mb-1 text-on-surface">Pro Plan</h3>
                <p className="text-on-surface-variant font-label-sm mb-lg">$99 / month</p>
                
                <div className="mb-2 flex justify-between font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant">
                  <span>Usage</span>
                  <span>145 / 500 Creatives</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '29%' }}></div>
                </div>

                <button className="mt-lg px-md py-sm bg-on-surface text-primary-container font-label-sm uppercase rounded hover:scale-95 transition-transform">
                  Upgrade Plan
                </button>
              </div>

              <h3 className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mb-sm">Invoice History</h3>
              <div className="space-y-xs">
                {[1,2,3].map(i => (
                  <div key={i} className="flex justify-between items-center p-sm border border-outline-variant/50 rounded bg-surface hover:bg-surface-container-high transition-colors">
                    <div>
                      <p className="font-label-sm text-sm text-on-surface mb-1">May 1, 2026</p>
                      <p className="text-[11px] text-on-surface-variant font-body-md">Pro Plan - $99.00</p>
                    </div>
                    <button className="text-xs font-label-sm text-primary hover:text-on-surface transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Danger" && (
            <div className="glass-panel border border-error/30 rounded-xl p-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-error/50 to-transparent"></div>
              <h2 className="font-headline-lg text-xl mb-2 text-error">Danger Zone</h2>
              <p className="text-on-surface-variant mb-lg font-body-md text-sm max-w-md">
                Once you delete your account, there is no going back. All campaigns, creatives, and brand settings will be permanently erased.
              </p>
              <button className="px-md py-sm bg-error-container/10 text-error border border-error/30 font-label-sm uppercase rounded hover:bg-error-container/20 transition-colors">
                Delete Account
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
