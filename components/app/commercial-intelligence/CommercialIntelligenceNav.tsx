"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROCI588_CUSTOMER_SECTIONS, type Roci588CustomerSection } from "@/lib/commercial-intelligence-engine/config";

type Props = {
  labels: Record<Roci588CustomerSection, string>;
};

function sectionFromPath(pathname: string): Roci588CustomerSection {
  if (pathname === "/app/revenue" || pathname === "/app/revenue/") return "overview";
  const match = ROCI588_CUSTOMER_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}

export function CommercialIntelligenceNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);

  return (
    <nav aria-label="Commercial Intelligence" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {ROCI588_CUSTOMER_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key
              ? "bg-indigo-700 text-white"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
