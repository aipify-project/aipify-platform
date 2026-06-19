"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SERVICE_NETWORK_SECTIONS,
  getServiceNetworkActiveSection,
} from "@/lib/service-network-engine/config";

export function ServiceNetworkNav({
  labels,
}: {
  labels: Record<string, string>;
}) {
  const pathname = usePathname();
  const active = getServiceNetworkActiveSection(pathname);

  return (
    <nav aria-label="Service network sections" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {SERVICE_NETWORK_SECTIONS.map((section) => {
        const isActive = active === section.key;
        return (
          <Link
            key={section.key}
            href={section.href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-violet-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {labels[section.key] ?? section.key}
          </Link>
        );
      })}
    </nav>
  );
}
