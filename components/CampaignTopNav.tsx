"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CampaignTopNav({ campaignId, campaignName }: { campaignId: string, campaignName: string }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Overview", href: "overview" },
    { label: "Generate", href: "generate" },
    { label: "Creatives", href: "creatives" },
    { label: "Analytics", href: "analytics" },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-xl text-primary font-body-md text-body-md docked full-width top-0 border-b border-outline-variant flat no shadows flex flex-col w-full z-50 shrink-0">
      <div className="flex justify-between items-center px-md h-16">
        {/* Breadcrumbs / Context */}
        <div className="flex items-center gap-sm text-on-surface-variant text-sm">
          <Link href="/campaigns" className="material-symbols-outlined text-[18px] cursor-pointer active:scale-95 hover:text-primary transition-colors duration-200">arrow_back</Link>
          <Link href="/campaigns" className="cursor-pointer hover:text-on-surface transition-colors">Campaigns</Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-medium truncate max-w-[200px] md:max-w-[400px]">{campaignName}</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined cursor-pointer active:scale-95 text-on-surface-variant hover:text-primary transition-colors duration-200">notifications</span>
            <span className="material-symbols-outlined cursor-pointer active:scale-95 text-on-surface-variant hover:text-primary transition-colors duration-200">help</span>
          </div>
          <Link href="/campaigns/new" className="bg-on-surface text-surface px-4 py-2 rounded font-label-sm font-bold text-label-sm uppercase hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all cursor-pointer active:scale-95 whitespace-nowrap">
            Create Campaign
          </Link>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-md px-md pt-2">
        {tabs.map(tab => {
          const href = `/campaigns/${campaignId}/${tab.href}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link 
              key={tab.href}
              href={href}
              className={`pb-2 font-label-sm text-xs uppercase tracking-wider transition-colors border-b-2 ${
                isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
