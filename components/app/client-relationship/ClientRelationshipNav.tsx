"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CRM611_SECTIONS, getCrm611ActiveSection } from "@/lib/client-relationship-engine/config";
import type { buildClientRelationshipLabels } from "@/lib/client-relationship-engine/labels";

type Labels = ReturnType<typeof buildClientRelationshipLabels>;

export function ClientRelationshipNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCrm611ActiveSection(pathname);

  return (
    <nav aria-label="Client Relationships" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CRM611_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key
              ? "bg-violet-700 text-white"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
