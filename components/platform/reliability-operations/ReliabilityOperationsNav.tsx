"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REL604_PLATFORM_SECTIONS, getRel604PlatformActiveSection } from "@/lib/reliability-operations-engine/config";
import type { buildReliabilityOperationsLabels } from "@/lib/reliability-operations-engine/labels";

type Labels = ReturnType<typeof buildReliabilityOperationsLabels>["sections"];

export function ReliabilityOperationsNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();
  const active = getRel604PlatformActiveSection(pathname);

  return (
    <nav aria-label="Reliability Operations" className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {REL604_PLATFORM_SECTIONS.map((item) => (
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
