"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PARTNER_BC607_SECTIONS,
  getPartnerBc607ActiveSection,
} from "@/lib/business-continuity-engine/config";
import type { buildPartnerBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";

type Labels = ReturnType<typeof buildPartnerBusinessContinuityLabels>;

export function PartnerBusinessContinuityNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getPartnerBc607ActiveSection(pathname);

  return (
    <nav aria-label="Partner Business Continuity" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {PARTNER_BC607_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-violet-800 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
