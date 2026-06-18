"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REVENUE_GROWTH_SECTIONS, type RevenueGrowthSection } from "@/lib/revenue-growth-center";
import type { RevenueGrowthCenterLabels } from "@/lib/revenue-growth-center/labels";

type Props = { labels: RevenueGrowthCenterLabels["sections"] };

function sectionFromPath(pathname: string): RevenueGrowthSection {
  if (pathname === "/app/revenue-growth" || pathname === "/app/revenue-growth/") return "overview";
  const match = REVENUE_GROWTH_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function RevenueGrowthNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);
  return (
    <nav aria-label="Revenue Growth" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {REVENUE_GROWTH_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-emerald-700 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
