"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ROCI588_PLATFORM_SECTIONS,
  getRoci588PlatformActiveNavId,
} from "@/lib/commercial-intelligence-engine/config";

type Props = { labels: Record<string, string> };

export function PlatformCommercialIntelligenceSubNav({ labels }: Props) {
  const pathname = usePathname();
  const active = getRoci588PlatformActiveNavId(pathname);

  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-4" aria-label="Commercial Intelligence navigation">
      {ROCI588_PLATFORM_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.key
              ? "border border-sky-200 bg-sky-50 text-sky-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-sky-50 hover:text-sky-800"
          }`}
        >
          {labels[item.key] ?? item.key}
        </Link>
      ))}
    </nav>
  );
}
