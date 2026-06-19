"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CMRI594_SECTIONS, getCmri594ActiveSection } from "@/lib/companion-memory-center-engine/config";
import type { buildCompanionMemoryCenterLabels } from "@/lib/companion-memory-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionMemoryCenterLabels>;

export function CompanionMemoryCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCmri594ActiveSection(pathname);

  return (
    <nav aria-label="Memory Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CMRI594_SECTIONS.map((item) => (
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
