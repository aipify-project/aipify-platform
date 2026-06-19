"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CMP614_SECTIONS, getCmp614ActiveSection } from "@/lib/compensation-engine/config";
import type { buildCompensationLabels } from "@/lib/compensation-engine/labels";

type Labels = ReturnType<typeof buildCompensationLabels>;

export function CompensationNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCmp614ActiveSection(pathname);

  return (
    <nav aria-label="Compensation" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CMP614_SECTIONS.map((item) => (
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
