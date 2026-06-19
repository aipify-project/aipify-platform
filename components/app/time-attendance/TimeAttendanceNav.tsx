"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TA609_SECTIONS, getTa609ActiveSection } from "@/lib/time-attendance-engine/config";
import type { buildTimeAttendanceLabels } from "@/lib/time-attendance-engine/labels";

type Labels = ReturnType<typeof buildTimeAttendanceLabels>;

export function TimeAttendanceNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getTa609ActiveSection(pathname);

  return (
    <nav aria-label="Time & Attendance" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {TA609_SECTIONS.map((item) => (
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
