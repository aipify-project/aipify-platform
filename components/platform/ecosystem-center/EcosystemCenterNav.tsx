"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EP601_SECTIONS, getEp601ActiveSection } from "@/lib/ecosystem-center-engine/config";
import type { buildEcosystemCenterLabels } from "@/lib/ecosystem-center-engine/labels";

type Labels = ReturnType<typeof buildEcosystemCenterLabels>["sections"];

export function EcosystemCenterNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();
  const active = getEp601ActiveSection(pathname);

  return (
    <nav aria-label="Ecosystem Center" className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {EP601_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.key
              ? "border border-violet-200 bg-violet-50 text-violet-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-800"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
