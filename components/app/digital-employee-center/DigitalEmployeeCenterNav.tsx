"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEWF598_SECTIONS, getDewf598ActiveSection } from "@/lib/digital-employee-center-engine/config";
import type { buildDigitalEmployeeCenterLabels } from "@/lib/digital-employee-center-engine/labels";

type Labels = ReturnType<typeof buildDigitalEmployeeCenterLabels>;

export function DigitalEmployeeCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getDewf598ActiveSection(pathname);

  return (
    <nav aria-label="Digital Employee Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {DEWF598_SECTIONS.map((item) => (
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
