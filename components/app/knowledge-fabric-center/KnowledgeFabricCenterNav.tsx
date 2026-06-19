"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KFTW597_SECTIONS, getKftw597ActiveSection } from "@/lib/knowledge-fabric-center-engine/config";
import type { buildKnowledgeFabricCenterLabels } from "@/lib/knowledge-fabric-center-engine/labels";

type Labels = ReturnType<typeof buildKnowledgeFabricCenterLabels>;

export function KnowledgeFabricCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getKftw597ActiveSection(pathname);

  return (
    <nav aria-label="Knowledge Fabric Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {KFTW597_SECTIONS.map((item) => (
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
