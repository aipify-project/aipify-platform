"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHG605_SECTIONS, CHG605_SPECIAL_ROUTES, getChg605ActiveSection } from "@/lib/change-operations-engine/config";
import type { buildChangeOperationsLabels } from "@/lib/change-operations-engine/labels";

type Labels = ReturnType<typeof buildChangeOperationsLabels>["sections"] & {
  calendar: string;
  history: string;
  advisory: string;
};

export function ChangeOperationsNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();
  const active = getChg605ActiveSection(pathname);

  const special = [
    { key: "calendar" as const, href: CHG605_SPECIAL_ROUTES.calendar, label: labels.calendar },
    { key: "history" as const, href: CHG605_SPECIAL_ROUTES.history, label: labels.history },
    { key: "advisory" as const, href: CHG605_SPECIAL_ROUTES.advisory, label: labels.advisory },
  ];

  return (
    <nav aria-label="Change Operations" className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {CHG605_SECTIONS.map((item) => (
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
      {special.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.key
              ? "border border-indigo-200 bg-indigo-50 text-indigo-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
