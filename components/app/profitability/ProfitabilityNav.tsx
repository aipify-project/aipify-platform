"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROF615_SECTIONS, getProf615ActiveSection } from "@/lib/profitability-engine/config";
import type { buildProfitabilityLabels } from "@/lib/profitability-engine/labels";

type Labels = ReturnType<typeof buildProfitabilityLabels>;

export function ProfitabilityNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getProf615ActiveSection(pathname);

  return (
    <nav aria-label="Profitability" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {PROF615_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-violet-700 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
