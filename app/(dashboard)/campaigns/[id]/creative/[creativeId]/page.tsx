"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Play } from "lucide-react";

export default function CreativePreviewPage({ params }: { params: any }) {
  const [device, setDevice] = useState("Feed");
  const [activeVariant, setActiveVariant] = useState(1);

  return (
    <div className="min-h-screen bg-slate-900 font-[Inter] flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT: Device Preview Area (60%) */}
      <div className="w-full md:w-[60%] flex flex-col items-center justify-center p-8 bg-slate-900 relative border-r border-slate-800">
        
        {/* Device Toggles */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {['Feed', 'Story', 'Desktop'].map(d => (
            <button 
              key={d} onClick={() => setDevice(d)}
              className={`px-4 py-2 border border-slate-800 rounded-xl font-bold text-sm uppercase rounded-full transition-colors ${
                device === d ? 'bg-indigo-600 text-slate-100' : 'bg-slate-950 text-slate-100 hover:bg-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Device Frame Mockup */}
        <div className={`border border-slate-800 rounded-xl bg-slate-950 shadow-[var(--nb-shadow)] relative mt-16 transition-all duration-300 ${
          device === 'Feed' ? 'w-[375px] h-[667px]' : 
          device === 'Story' ? 'w-[375px] h-[812px]' : 'w-[800px] h-[600px]'
        }`}>
          
          {/* Mockup Top Bar */}
          <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full border border-slate-800 rounded-xl bg-slate-950"></div>
            <div className="w-3 h-3 rounded-full border border-slate-800 rounded-xl bg-slate-950"></div>
            <div className="w-3 h-3 rounded-full border border-slate-800 rounded-xl bg-slate-950"></div>
          </div>

          {/* Creative Content */}
          <div className="w-full h-[calc(100%-40px)] relative bg-slate-900 flex flex-col">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-800 rounded-xl bg-slate-900"></div>
              <div className="font-bold text-sm">Adverto Brand</div>
            </div>
            
            <div className="flex-1 bg-slate-900/5 relative group flex items-center justify-center border-y border-slate-800">
              {/* Play Button Overlay for Video */}
              <button className="w-16 h-16 rounded-full bg-indigo-600 border border-slate-800 rounded-xl shadow-lg shadow-black/50 flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-black translate-x-0.5" />
              </button>
            </div>

            <div className="p-4">
              <div className="font-bold text-sm mb-1">New Collection Drop</div>
              <div className="text-xs text-slate-100 line-clamp-2">Shop the latest neo-brutalist styles. High contrast, sharp edges.</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Editing Panel (40%) */}
      <div className="w-full md:w-[40%] bg-slate-950 h-screen overflow-y-auto flex flex-col p-8 relative">
        <Link href="/campaigns/123" className="absolute top-8 right-8 p-2 border border-slate-800 rounded-xl bg-slate-950 shadow-md shadow-black/50 hover:-translate-y-0.5 hover:shadow-none transition-all">
          <X className="w-5 h-5" />
        </Link>

        <div className="mb-8 pr-16">
          <span className="bg-indigo-600 border border-slate-800 rounded-xl px-3 py-1  font-bold text-lg uppercase shadow-md shadow-black/50 inline-block mb-4">
            VIDEO
          </span>
          <h2 className="font-bold text-xl tracking-tight">Edit Creative</h2>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block font-bold text-sm uppercase mb-2">Headline</label>
            <input 
              type="text" 
              defaultValue="New Collection Drop"
              className="w-full h-14 border border-slate-800 rounded-xl px-4  font-bold text-xl focus:outline-none focus:bg-slate-900 shadow-md shadow-black/50"
            />
          </div>
          
          <div>
            <label className="block font-bold text-sm uppercase mb-2">Body Copy</label>
            <textarea 
              rows={4}
              defaultValue="Shop the latest neo-brutalist styles. High contrast, sharp edges."
              className="w-full border border-slate-800 rounded-xl p-4 font-bold text-sm focus:outline-none focus:bg-slate-900 shadow-md shadow-black/50 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-sm uppercase mb-2">CTA Text</label>
            <input 
              type="text" 
              defaultValue="Shop Now"
              className="w-full h-12 border border-slate-800 rounded-xl px-4 font-bold text-sm focus:outline-none focus:bg-slate-900 shadow-md shadow-black/50"
            />
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h3 className="font-bold text-sm uppercase mb-4">Variants</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3].map(v => (
                <button 
                  key={v} onClick={() => setActiveVariant(v)}
                  className={`w-20 h-24 shrink-0 border-2 bg-slate-900 transition-all ${
                    activeVariant === v ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105' : 'border-slate-800'
                  }`}
                >
                  <div className="w-full h-1/2 bg-slate-900/5 border-b border-slate-800"></div>
                  <div className="p-1 font-bold text-[8px] uppercase">V{v}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="border border-slate-800 rounded-xl bg-slate-900 p-2 text-center">
              <div className="text-[10px] font-bold uppercase mb-1">Spend</div>
              <div className="font-bold text-xs">$120</div>
            </div>
            <div className="border border-slate-800 rounded-xl bg-slate-900 p-2 text-center">
              <div className="text-[10px] font-bold uppercase mb-1">CTR</div>
              <div className="font-bold text-xs">1.8%</div>
            </div>
            <div className="border border-slate-800 rounded-xl bg-slate-900 p-2 text-center">
              <div className="text-[10px] font-bold uppercase mb-1">ROAS</div>
              <div className="font-bold text-xs text-emerald-400">3.2x</div>
            </div>
            <div className="border border-slate-800 rounded-xl bg-slate-900 p-2 text-center">
              <div className="text-[10px] font-bold uppercase mb-1">CPA</div>
              <div className="font-bold text-xs">$12.40</div>
            </div>
          </div>

          <button className="w-full py-4 bg-slate-900 text-indigo-400 font-bold uppercase border border-slate-800 rounded-xl shadow-lg shadow-black/50 hover:-translate-y-0.5 hover:shadow-md shadow-black/50 transition-all">
            Publish to Meta
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 bg-slate-950 text-slate-100 font-bold uppercase border border-slate-800 rounded-xl shadow-md shadow-black/50 hover:-translate-y-0.5 hover:shadow-none transition-all text-xs">
              Re-generate
            </button>
            <button className="py-3 bg-slate-950 text-rose-400 font-bold uppercase border border-rose-500 rounded-xl shadow-2xl shadow-indigo-500/10 hover:-translate-y-0.5 hover:shadow-none transition-all text-xs hover:bg-rose-600 hover:text-white">
              Reject
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
