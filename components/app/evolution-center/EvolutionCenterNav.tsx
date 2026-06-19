"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CE600_SECTIONS, getCe600ActiveSection } from "@/lib/evolution-center-engine/config";
import type { buildEvolutionCenterLabels } from "@/lib/evolution-center-engine/labels";

type Labels = ReturnType<typeof buildEvolutionCenterLabels>;

export function EvolutionCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCe600ActiveSection(pathname);

  return (
    <nav aria-label="Evolution Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CE600_SECTIONS.map((item) => (
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
