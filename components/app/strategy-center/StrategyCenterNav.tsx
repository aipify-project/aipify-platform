"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIBO589_SECTIONS, getSibo589ActiveSection } from "@/lib/strategy-center-engine/config";
import type { buildStrategyCenterLabels } from "@/lib/strategy-center-engine/labels";

type Labels = ReturnType<typeof buildStrategyCenterLabels>;

export function StrategyCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getSibo589ActiveSection(pathname);

  return (
    <nav aria-label="Strategy Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {SIBO589_SECTIONS.map((item) => (
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
