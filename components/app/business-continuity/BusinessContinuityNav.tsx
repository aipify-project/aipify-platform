"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BC607_SECTIONS, getBc607ActiveSection } from "@/lib/business-continuity-engine/config";
import type { buildBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";

type Labels = ReturnType<typeof buildBusinessContinuityLabels>;

export function BusinessContinuityNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getBc607ActiveSection(pathname);

  return (
    <nav aria-label="Business Continuity" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {BC607_SECTIONS.map((item) => (
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
      <Link
        href="/app/business-continuity/crisis"
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname.startsWith("/app/business-continuity/crisis")
            ? "bg-red-700 text-white"
            : "text-red-700 hover:bg-red-50"
        }`}
      >
        Crisis
      </Link>
      <Link
        href="/app/business-continuity/recovery"
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname.startsWith("/app/business-continuity/recovery")
            ? "bg-indigo-700 text-white"
            : "text-indigo-700 hover:bg-indigo-50"
        }`}
      >
        Recovery
      </Link>
    </nav>
  );
}
