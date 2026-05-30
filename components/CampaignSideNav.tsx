"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Images, Sparkles, BarChart2, Zap } from "lucide-react";

const primary = [
  { label: "Overview", href: "overview", icon: LayoutDashboard },
  { label: "Creatives", href: "creatives", icon: Images },
  { label: "Generate", href: "generate", icon: Sparkles },
];

const secondary = [
  { label: "Analytics", href: "analytics", icon: BarChart2 },
  { label: "Opt Log", href: "optimize", icon: Zap },
];

export default function CampaignSideNav({ campaignId }: { campaignId: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 bg-base-200 border-r border-base-300 flex flex-col">
      {/* Primary nav */}
      <div className="flex flex-col gap-1 p-2">
        {primary.map(({ label, href, icon: Icon }) => {
          const fullHref = `/campaigns/${campaignId}/${href}`;
          const active = pathname === fullHref;
          return (
            <Link
              key={href}
              href={fullHref}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-content"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-300"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Secondary nav */}
      <div className="flex flex-col gap-1 p-2 mt-auto border-t border-base-300">
        {secondary.map(({ label, href, icon: Icon }) => {
          const fullHref = `/campaigns/${campaignId}/${href}`;
          return (
            <Link
              key={href}
              href={fullHref}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-base-content/40 hover:text-base-content hover:bg-base-300 transition-colors"
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
