"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CARE593_SECTIONS, getCare593ActiveSection } from "@/lib/companion-action-center-engine/config";
import type { buildCompanionActionCenterLabels } from "@/lib/companion-action-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionActionCenterLabels>;

export function CompanionActionCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCare593ActiveSection(pathname);

  return (
    <nav aria-label="Action Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CARE593_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-amber-800 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
