"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function CampaignTabNav({ campaignName }: { campaignId: string; campaignName: string }) {
  return (
    <div className="h-12 bg-base-200 border-b border-base-300 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/campaigns" className="btn btn-ghost btn-sm btn-circle" aria-label="Back to campaigns">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="font-bold text-base-content text-sm truncate max-w-[220px]">{campaignName}</span>
      </div>
      <ThemeToggle />
    </div>
  );
}
