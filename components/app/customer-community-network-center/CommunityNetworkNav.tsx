"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMMUNITY_NETWORK_SECTIONS, type CommunityNetworkSection } from "@/lib/customer-community-network-center";
import type { CommunityNetworkCenterLabels } from "@/lib/customer-community-network-center/labels";

type Props = { labels: CommunityNetworkCenterLabels["sections"] };

function sectionFromPath(pathname: string): CommunityNetworkSection {
  if (pathname === "/app/community" || pathname === "/app/community/") return "overview";
  const match = COMMUNITY_NETWORK_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function CommunityNetworkNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);
  return (
    <nav aria-label="Community Network" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {COMMUNITY_NETWORK_SECTIONS.map((item) => (
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
