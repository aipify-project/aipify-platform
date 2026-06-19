"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WFS608_SECTIONS, getWfs608ActiveSection } from "@/lib/workforce-scheduling-engine/config";
import type { buildWorkforceSchedulingLabels } from "@/lib/workforce-scheduling-engine/labels";

type Labels = ReturnType<typeof buildWorkforceSchedulingLabels>;

export function WorkforceSchedulingNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getWfs608ActiveSection(pathname);

  return (
    <nav aria-label="Workforce Scheduling" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {WFS608_SECTIONS.map((item) => (
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
