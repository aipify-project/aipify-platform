"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BPR603_PLATFORM_SECTIONS, getBpr603PlatformActiveSection } from "@/lib/business-pack-runtime-engine/config";

type Props = { labels: Record<string, string> };

export function BusinessPackRuntimePlatformNav({ labels }: Props) {
  const pathname = usePathname();
  const active = getBpr603PlatformActiveSection(pathname);

  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-4" aria-label="Business Pack Runtime navigation">
      {BPR603_PLATFORM_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.key
              ? "border border-violet-200 bg-violet-50 text-violet-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-800"
          }`}
        >
          {labels[item.key] ?? item.key}
        </Link>
      ))}
    </nav>
  );
}
