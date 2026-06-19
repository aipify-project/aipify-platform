"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CIPA595_SECTIONS, getCipa595ActiveSection } from "@/lib/companion-identity-center-engine/config";
import type { buildCompanionIdentityCenterLabels } from "@/lib/companion-identity-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionIdentityCenterLabels>;

export function CompanionIdentityCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCipa595ActiveSection(pathname);

  return (
    <nav aria-label="Companion Identity Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CIPA595_SECTIONS.map((item) => (
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
