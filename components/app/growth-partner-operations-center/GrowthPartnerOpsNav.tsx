"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GROWTH_PARTNER_OPS_SECTIONS,
  type GrowthPartnerOpsSection,
} from "@/lib/growth-partner-operations-center";
import type { GrowthPartnerOperationsCenterLabels } from "@/lib/growth-partner-operations-center/labels";

type Props = {
  labels: GrowthPartnerOperationsCenterLabels["sections"];
};

function sectionFromPath(pathname: string): GrowthPartnerOpsSection {
  if (pathname === "/app/growth-partner" || pathname === "/app/growth-partner/") return "dashboard";
  const match = GROWTH_PARTNER_OPS_SECTIONS.find(
    (s) => s.key !== "dashboard" && pathname.startsWith(s.href)
  );
  return match?.key ?? "dashboard";
}

export function GrowthPartnerOpsNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);

  return (
    <nav
      aria-label="Growth Partner Operations"
      className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4"
    >
      {GROWTH_PARTNER_OPS_SECTIONS.map((item) => {
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-violet-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
