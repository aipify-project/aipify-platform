"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AOS599_SECTIONS, getAos599ActiveSection } from "@/lib/aos-center-engine/config";
import type { buildAosCenterLabels } from "@/lib/aos-center-engine/labels";

type Labels = ReturnType<typeof buildAosCenterLabels>;

export function AosCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getAos599ActiveSection(pathname);

  return (
    <nav aria-label="Aipify OS Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {AOS599_SECTIONS.map((item) => (
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
