"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <nav className={`hidden md:flex flex-col h-screen py-md px-xs sticky left-0 top-0 bg-surface-container-lowest border-r border-outline-variant z-40 shrink-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      
      {/* Brand Header */}
      <div className={`mb-xl flex items-center ${isCollapsed ? "justify-center px-0" : "px-md gap-sm"}`}>
        <div className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center border border-outline-variant shrink-0">
          <span className="font-bold text-primary font-label-sm">A</span>
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <div className="font-headline-lg text-headline-lg tracking-tighter text-on-surface text-xl">Adverto AI</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">Precision Ads</div>
          </div>
        )}
      </div>
      
      {/* Main Nav Links */}
      <div className="flex-1 flex flex-col gap-xs">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              title={link.label}
              className={`flex items-center px-md py-sm rounded-r-lg transition-all duration-300 ease-in-out cursor-pointer group ${isCollapsed ? "justify-center !px-0 mx-2 rounded-lg" : "gap-sm"} ${
                isActive 
                  ? "text-primary border-r-2 border-primary bg-primary/5" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              } ${isCollapsed && isActive ? "!border-r-0 !border-l-2" : ""}`}
            >
              <span 
                className="material-symbols-outlined shrink-0" 
                data-weight={isActive ? "fill" : undefined}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {link.icon}
              </span>
              {!isCollapsed && <span className="font-label-sm text-label-sm whitespace-nowrap overflow-hidden">{link.label}</span>}
            </Link>
          );
        })}
      </div>
      
      {/* Bottom Section */}
      <div className="mt-auto flex flex-col gap-sm">
        
        {/* Upgrade Plan Button */}
        <div className="px-xs">
          <button 
            title="Upgrade Plan"
            className={`w-full bg-primary-container text-primary rounded border border-primary/20 hover:bg-primary hover:text-background transition-colors duration-300 flex justify-center items-center ${isCollapsed ? "py-2 px-0" : "py-sm gap-xs"}`}
          >
            {isCollapsed ? (
              <span className="material-symbols-outlined text-[20px]">star</span>
            ) : (
              <span className="font-label-sm text-label-sm whitespace-nowrap">Upgrade Plan</span>
            )}
          </button>
        </div>
        
        {/* Bottom Nav Links */}
        <div className={`flex flex-col gap-xs pt-sm border-t border-outline-variant ${isCollapsed ? "items-center" : ""}`}>
          {bottomLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                title={link.label}
                className={`flex items-center py-xs transition-colors duration-200 ${isCollapsed ? "justify-center w-10 h-10 rounded-full hover:bg-surface-container-low" : "gap-sm px-md"} ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span 
                  className="material-symbols-outlined text-sm shrink-0"
                  data-weight={isActive ? "fill" : undefined}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                {!isCollapsed && <span className="font-label-sm text-label-sm whitespace-nowrap">{link.label}</span>}
              </Link>
            );
          })}
        </div>
        
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-center pt-xs">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mx-xs flex items-center justify-center py-2 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="material-symbols-outlined text-sm">
              {isCollapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left"}
            </span>
          </button>
        </div>

        {/* Footer Actions (Theme, Notifications, Avatar) */}
        <div className={`flex items-center pt-sm border-t border-outline-variant mt-xs mb-sm ${isCollapsed ? "flex-col gap-md" : "justify-between px-md"}`}>
          <div className={`flex items-center ${isCollapsed ? "flex-col gap-md" : "gap-xs"}`}>
            <ThemeToggle />
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
          <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer flex items-center justify-center text-[10px] font-bold text-on-surface shrink-0">
            U
          </div>
        </div>
      </div>
    </nav>
  );
}
