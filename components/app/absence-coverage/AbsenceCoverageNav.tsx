"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VAC606_SECTIONS, getVac606ActiveSection } from "@/lib/absence-coverage-engine/config";
import type { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";

type Labels = ReturnType<typeof buildAbsenceCoverageLabels>;

export function AbsenceCoverageNav({
  labels,
  basePath = "/app/absence",
}: {
  labels: Labels["sections"];
  basePath?: string;
}) {
  const pathname = usePathname();
  const active = getVac606ActiveSection(pathname, basePath);

  return (
    <nav aria-label="Absence Coverage" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {VAC606_SECTIONS.map((item) => {
        const href = item.href.replace("/app/absence", basePath);
        return (
          <Link
            key={item.key}
            href={href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active === item.key ? "bg-violet-800 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
