"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OIH592_SECTIONS, getOih592ActiveSection } from "@/lib/integration-center-engine/config";
import type { buildIntegrationCenterLabels } from "@/lib/integration-center-engine/labels";

type Labels = ReturnType<typeof buildIntegrationCenterLabels>;

export function IntegrationCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getOih592ActiveSection(pathname);

  return (
    <nav aria-label="Integration Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {OIH592_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-sky-700 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
