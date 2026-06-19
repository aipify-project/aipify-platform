"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CIFE596_SECTIONS, getCife596ActiveSection } from "@/lib/companion-feedback-center-engine/config";
import type { buildCompanionFeedbackCenterLabels } from "@/lib/companion-feedback-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionFeedbackCenterLabels>;

export function CompanionFeedbackCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getCife596ActiveSection(pathname);

  return (
    <nav aria-label="Feedback Center" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {CIFE596_SECTIONS.map((item) => (
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
