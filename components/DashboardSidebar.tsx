"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/campaigns", icon: "ads_click", label: "Campaigns" },
    { href: "/assets", icon: "inventory_2", label: "Assets" },
    { href: "/analytics", icon: "insights", label: "Analytics" },
    { href: "/settings", icon: "settings", label: "Settings" },
  ];

  const bottomLinks = [
    { href: "/support", icon: "contact_support", label: "Support" },
    { href: "/documentation", icon: "menu_book", label: "Documentation" },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen py-md px-xs sticky left-0 top-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-40 shrink-0">
      <div className="px-md mb-xl flex items-center gap-sm">
        <div className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center border border-outline-variant">
          <span className="font-bold text-primary font-label-sm">A</span>
        </div>
        <div>
          <div className="font-headline-lg text-headline-lg tracking-tighter text-on-surface text-xl">Adverto AI</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">Precision Ads</div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-xs">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center gap-sm px-md py-sm rounded-r-lg transition-all duration-300 ease-in-out cursor-pointer group ${
                isActive 
                  ? "text-primary border-r-2 border-primary bg-primary/5" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                data-weight={isActive ? "fill" : undefined}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {link.icon}
              </span>
              <span className="font-label-sm text-label-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto px-xs flex flex-col gap-sm">
        <button className="w-full bg-primary-container text-primary font-label-sm text-label-sm py-sm rounded border border-primary/20 hover:bg-primary hover:text-background transition-colors duration-300 flex justify-center items-center gap-xs">
          Upgrade Plan
        </button>
        
        <div className="flex flex-col gap-xs pt-sm border-t border-outline-variant">
          {bottomLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-sm px-md py-xs transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span 
                  className="material-symbols-outlined text-sm"
                  data-weight={isActive ? "fill" : undefined}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span className="font-label-sm text-label-sm">{link.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between px-md pt-sm border-t border-outline-variant mt-sm">
          <div className="flex items-center gap-xs">
            <ThemeToggle />
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
          <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer flex items-center justify-center text-[10px] font-bold text-on-surface">
            U
          </div>
        </div>
      </div>
    </nav>
  );
}
