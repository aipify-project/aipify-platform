"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OEB591_SECTIONS, getOeb591ActiveSection } from "@/lib/organizational-event-bus-engine/config";
import type { buildEventCenterLabels } from "@/lib/organizational-event-bus-engine/labels";

type Labels = ReturnType<typeof buildEventCenterLabels>;

export function EventCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getOeb591ActiveSection(pathname);

  return (
    <nav aria-label="Event Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {OEB591_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
